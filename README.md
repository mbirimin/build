# Construction Schedule App - EC2 Deployment

A construction project management application designed for deployment on AWS EC2 instances with local file storage.

## Features

- **Project Management**: Manage Build Day and Destroy Day schedules
- **Task Tracking**: Create, edit, and track construction tasks with subtasks
- **Progress Monitoring**: Real-time progress tracking with visual indicators
- **User Roles**: Admin and user access levels
- **File-based Storage**: No external database required
- **Automatic Backups**: Daily data backups with retention
- **Health Monitoring**: Built-in health checks and logging
- **Mobile Responsive**: Works on all device sizes

## Quick Start

### Prerequisites

- AWS EC2 instance (t3.micro or larger recommended)
- Amazon Linux 2 or Ubuntu 20.04+
- At least 1GB RAM and 10GB storage

### 1. Launch EC2 Instance

1. Launch an EC2 instance with Amazon Linux 2
2. Configure Security Group to allow:
   - SSH (port 22) from your IP
   - HTTP (port 80) from anywhere (0.0.0.0/0)
   - HTTPS (port 443) from anywhere (optional)

### 2. Upload Application Files

**Option A: Using SCP**
\`\`\`bash
# From your local machine
scp -i your-key.pem -r /path/to/project/* ec2-user@your-ec2-ip:~/construction-app/
\`\`\`

**Option B: Using Git**
\`\`\`bash
# On EC2 instance
git clone https://github.com/yourusername/construction-app.git ~/construction-app
\`\`\`

### 3. Deploy Application

\`\`\`bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Navigate to app directory
cd ~/construction-app

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
\`\`\`

The deployment script will:
- Install Node.js 18
- Install PM2 process manager
- Install and configure Nginx
- Set up automatic backups
- Configure log rotation
- Start the application

### 4. Access Your Application

After deployment, access your app at:
- **Main App**: `http://your-ec2-ip`
- **Health Check**: `http://your-ec2-ip/api/health`

## Manual Setup (Alternative)

If you prefer manual setup:

### 1. Install Dependencies

\`\`\`bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo yum install -y nginx
\`\`\`

### 2. Setup Application

\`\`\`bash
# Create app directory
mkdir -p ~/construction-app
cd ~/construction-app

# Install dependencies
npm install

# Run setup
npm run setup

# Build application
npm run build
\`\`\`

### 3. Start Services

\`\`\`bash
# Start application with PM2
pm2 start npm --name "construction-app" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
\`\`\`

## Configuration

### Environment Variables

Create `.env.local` file:

\`\`\`bash
NODE_ENV=production
PORT=3000
DATA_PATH=/home/ec2-user/construction-app/data
BACKUP_ENABLED=true
LOG_LEVEL=info
\`\`\`

### Nginx Configuration

The deploy script creates an Nginx configuration at `/etc/nginx/conf.d/construction-app.conf` with:
- Reverse proxy to Node.js app
- Gzip compression
- Security headers
- Static file caching

## Data Management

### File Structure

\`\`\`
data/
├── tasks.json          # Task data for all projects
├── projects.json       # Project configurations
└── backups/           # Automatic backups
    ├── tasks_2024-01-01_02-00-00.json
    └── projects_2024-01-01_02-00-00.json
\`\`\`

### Backups

- **Automatic**: Daily backups at 2 AM
- **Manual**: Run `./backup.sh`
- **Retention**: 7 days (configurable)
- **Location**: `~/construction-app/data/backups/`

### Restore from Backup

\`\`\`bash
# Stop application
pm2 stop construction-app

# Restore from backup
cd ~/construction-app/data
cp backups/tasks_YYYY-MM-DD_HH-MM-SS.json tasks.json
cp backups/projects_YYYY-MM-DD_HH-MM-SS.json projects.json

# Start application
pm2 start construction-app
\`\`\`

## Monitoring

### Application Status

\`\`\`bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs construction-app

# Monitor in real-time
pm2 monit
\`\`\`

### System Health

\`\`\`bash
# Check health endpoint
curl http://localhost:3000/api/health

# Check Nginx status
sudo systemctl status nginx

# View system logs
sudo journalctl -u nginx -f
\`\`\`

### Log Files

- **Application**: `~/construction-app/logs/`
- **Nginx**: `/var/log/nginx/`
- **PM2**: `~/.pm2/logs/`

## Maintenance

### Update Application

\`\`\`bash
# Pull latest changes (if using Git)
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart with zero downtime
pm2 reload construction-app
\`\`\`

### Scale Application

\`\`\`bash
# Run multiple instances
pm2 scale construction-app 2

# Or edit ecosystem.config.js and set instances: 'max'
pm2 reload ecosystem.config.js
\`\`\`

### SSL Certificate (Optional)

Install Let's Encrypt SSL:

\`\`\`bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

## Troubleshooting

### Application Won't Start

\`\`\`bash
# Check PM2 logs
pm2 logs construction-app

# Check if port is in use
sudo netstat -tlnp | grep :3000

# Restart application
pm2 restart construction-app
\`\`\`

### Nginx Issues

\`\`\`bash
# Test configuration
sudo nginx -t

# Check status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
\`\`\`

### Storage Issues

\`\`\`bash
# Check disk space
df -h

# Check data directory permissions
ls -la ~/construction-app/data/

# Fix permissions if needed
chmod 755 ~/construction-app/data/
\`\`\`

### Performance Issues

\`\`\`bash
# Check system resources
htop

# Check application memory usage
pm2 monit

# Restart if memory leak suspected
pm2 restart construction-app
\`\`\`

## Security Considerations

1. **Firewall**: Only open necessary ports (22, 80, 443)
2. **Updates**: Regularly update system packages
3. **Backups**: Ensure backups are working and test restores
4. **Monitoring**: Set up CloudWatch or similar monitoring
5. **SSL**: Use HTTPS in production with proper certificates

## Support

For issues or questions:
1. Check the logs: `pm2 logs construction-app`
2. Verify health: `curl http://localhost:3000/api/health`
3. Review this documentation
4. Check EC2 Security Groups and network configuration

## License

This project is licensed under the MIT License.
