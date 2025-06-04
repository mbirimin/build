#!/bin/bash

# EC2 Deployment Script for Construction Schedule App
# Run this script on your EC2 instance

set -e  # Exit on any error

echo "🚀 Starting deployment of Construction Schedule App..."

# Configuration
APP_DIR="/home/ec2-user/construction-app"
SERVICE_NAME="construction-app"
PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as ec2-user
if [ "$USER" != "ec2-user" ]; then
    print_error "This script should be run as ec2-user"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo yum update -y

# Install Node.js 18
print_status "Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
print_status "Node.js version: $node_version"
print_status "npm version: $npm_version"

# Install PM2 globally
print_status "Installing PM2..."
sudo npm install -g pm2

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown ec2-user:ec2-user $APP_DIR

# Navigate to app directory
cd $APP_DIR

# If package.json exists, install dependencies
if [ -f "package.json" ]; then
    print_status "Installing dependencies..."
    npm install
else
    print_error "package.json not found. Please upload your application files first."
    exit 1
fi

# Run setup script
print_status "Running application setup..."
npm run setup

# Build the application
print_status "Building the application..."
npm run build

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$SERVICE_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Stop existing PM2 process if running
print_status "Stopping existing application..."
pm2 stop $SERVICE_NAME 2>/dev/null || true
pm2 delete $SERVICE_NAME 2>/dev/null || true

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
print_status "Setting up PM2 startup script..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Install and configure nginx
print_status "Installing and configuring Nginx..."
sudo yum install -y nginx

# Create nginx configuration
sudo tee /etc/nginx/conf.d/construction-app.conf > /dev/null << EOF
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:$PORT/api/health;
        access_log off;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:$PORT;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

# Test nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

# Start and enable nginx
print_status "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall
print_status "Configuring firewall..."
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload 2>/dev/null || true

# Create log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/construction-app > /dev/null << EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 ec2-user ec2-user
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Create backup script
print_status "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ec2-user/backups"
APP_DIR="/home/ec2-user/construction-app"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup data directory
tar -czf "$BACKUP_DIR/data_backup_$DATE.tar.gz" -C "$APP_DIR" data/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "data_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: data_backup_$DATE.tar.gz"
EOF

chmod +x backup.sh

# Setup cron job for daily backups
print_status "Setting up daily backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup.sh") | crontab -

# Setup cron job for log cleanup
(crontab -l 2>/dev/null; echo "0 3 * * 0 curl -X POST http://localhost:$PORT/api/backup") | crontab -

# Final status check
print_status "Checking application status..."
sleep 5

if pm2 list | grep -q "$SERVICE_NAME.*online"; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application failed to start. Check logs with: pm2 logs $SERVICE_NAME"
    exit 1
fi

if sudo systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running successfully!"
else
    print_error "❌ Nginx failed to start. Check logs with: sudo journalctl -u nginx"
    exit 1
fi

# Get EC2 public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "Unable to fetch")

print_status "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  • Application: Running on port $PORT"
echo "  • Process Manager: PM2"
echo "  • Web Server: Nginx"
echo "  • Data Storage: Local file system"
echo "  • Backups: Daily at 2 AM"
echo "  • Logs: $APP_DIR/logs/"
echo ""
echo "🌐 Access your application:"
echo "  • Public IP: http://$PUBLIC_IP"
echo "  • Health Check: http://$PUBLIC_IP/api/health"
echo ""
echo "🔧 Useful commands:"
echo "  • Check app status: pm2 status"
echo "  • View app logs: pm2 logs $SERVICE_NAME"
echo "  • Restart app: pm2 restart $SERVICE_NAME"
echo "  • Check nginx: sudo systemctl status nginx"
echo "  • Manual backup: ./backup.sh"
echo ""
print_warning "Remember to configure your EC2 Security Group to allow HTTP (port 80) traffic!"
EOF
