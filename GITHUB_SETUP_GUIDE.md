# 🚀 GitHub Integration Setup Guide

This guide will walk you through setting up the complete GitHub integration for your Elite Chambers extension.

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Chrome Browser**: For testing the extension
3. **Basic Git Knowledge**: Understanding of git commands
4. **Discord Server**: For webhook notifications (optional)

## 🔧 Step-by-Step Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub**: Navigate to [github.com](https://github.com)
2. **Create New Repository**:
   - Click "New Repository"
   - Name: `findom-extension-data` (or your preferred name)
   - Description: "Data repository for Elite Chambers extension"
   - Set to **Public** or **Private** (your choice)
   - Initialize with README
3. **Copy Repository URL**: Save the repository URL for later

### Step 2: Generate GitHub Personal Access Token

1. **Go to Settings**: Click your profile → Settings
2. **Developer Settings**: Scroll down and click "Developer settings"
3. **Personal Access Tokens**: Click "Personal access tokens" → "Tokens (classic)"
4. **Generate New Token**:
   - Note: "Elite Chambers Extension Access"
   - Expiration: Choose appropriate duration (90 days recommended)
   - Scopes: Select **repo** (this gives full repository access)
5. **Copy Token**: Save the token securely - you won't see it again!

### Step 3: Set Up Local Repository

1. **Clone Your Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/findom-extension-data.git
   cd findom-extension-data
   ```

2. **Create Directory Structure**:
   ```bash
   mkdir tasks users config admin tributes submissions
   ```

3. **Create Initial Files**:
   - Copy the files from this extension's `tasks/`, `config/`, and `admin/` directories
   - Push to your repository:
   ```bash
   git add .
   git commit -m "Initial setup: Extension data structure"
   git push origin main
   ```

### Step 4: Install and Configure Extension

1. **Load Extension**:
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

2. **Access Admin Panel**:
   - Open file: `src/admin/admin-login.html` in your browser
   - Login with: `goddess` / `elite2024`

3. **Configure GitHub Integration**:
   - Go to Settings tab
   - Enter your repository: `YOUR_USERNAME/findom-extension-data`
   - Enter your GitHub token
   - Set sync interval: 15 minutes
   - Click "Save GitHub Settings"

### Step 5: Set Up Discord Integration (Optional)

1. **Create Discord Webhook**:
   - Go to your Discord server
   - Server Settings → Integrations → Webhooks
   - Create webhook for desired channel
   - Copy webhook URL

2. **Configure Discord in Admin Panel**:
   - Go to Settings tab
   - Enter Discord webhook URL
   - Set notification channel
   - Click "Save Discord Settings"

### Step 6: Test the Integration

1. **Test GitHub Sync**:
   - In admin panel, click "Sync with GitHub"
   - Check your GitHub repository for updated files
   - Verify tasks appear in the extension

2. **Test Task Creation**:
   - Create a new task in admin panel
   - Check if it appears in GitHub repository
   - Verify extension users can see the task

3. **Test Discord Notifications**:
   - Submit a tribute or complete a task
   - Check Discord for notification

## 📁 Repository Structure After Setup

Your GitHub repository should look like this:

```
findom-extension-data/
├── tasks/
│   ├── README.md
│   ├── task-daily-tribute.json
│   ├── task-weekly-report.json
│   ├── task-proof-submission.json
│   └── task-special-challenge.json
├── config/
│   ├── extension-settings.json
│   └── task-config.json
├── admin/
│   ├── admin-config.json
│   └── activation-codes.json
├── users/              # Auto-generated
├── tributes/           # Auto-generated
├── submissions/        # Auto-generated
└── README.md
```

## 🔐 Security Configuration

### GitHub Token Security
- **Never commit tokens**: Keep tokens out of code
- **Use environment variables**: For production deployments
- **Rotate tokens regularly**: Every 90 days recommended
- **Minimum permissions**: Only grant necessary repository access

### Admin Panel Security
- **Change default credentials**: Update admin username/password
- **Secure admin files**: Don't host admin panel publicly
- **Use HTTPS**: Always use secure connections
- **Monitor access**: Check admin panel logs regularly

## 🚀 Advanced Configuration

### Custom Task Types
Edit `config/task-config.json`:
```json
{
  "categories": ["daily", "weekly", "special", "punishment", "custom"],
  "customCategories": {
    "custom": {
      "pointsMultiplier": 1.5,
      "autoApproval": false,
      "requiresProof": true
    }
  }
}
```

### Auto-Approval Settings
Edit `admin/admin-config.json`:
```json
{
  "autoApprovalEnabled": true,
  "autoApprovalThreshold": 80,
  "autoApprovalConditions": {
    "minObedienceLevel": 75,
    "maxTaskDifficulty": "medium"
  }
}
```

### Discord Message Customization
In the GitHub sync code, modify Discord messages:
```javascript
const discordData = {
  embeds: [{
    title: "💰 Custom Tribute Message",
    description: `Custom tribute notification`,
    color: 0xe74c3c,
    // ... customize fields
  }]
};
```

## 🔄 Synchronization Workflow

### How It Works
1. **Extension → GitHub**: Users submit tributes/tasks → Data pushed to GitHub
2. **GitHub → Extension**: Admin creates tasks → Tasks sync to extension
3. **Admin Panel**: Manages all data through GitHub API
4. **Discord**: Real-time notifications for all activities

### Sync Frequency
- **Automatic**: Every 15 minutes (configurable)
- **Manual**: Admin panel sync button
- **Event-based**: Immediate sync on task creation/completion

### Conflict Resolution
- **GitHub takes precedence**: Server data overrides local
- **Backup creation**: Local backup before sync
- **Error handling**: Graceful degradation if sync fails

## 🛠️ Troubleshooting

### Common Issues

1. **GitHub Sync Fails**:
   - Check token permissions
   - Verify repository exists
   - Check internet connection
   - Review browser console for errors

2. **Admin Panel Won't Load**:
   - Clear browser cache
   - Check file permissions
   - Verify all files are present
   - Try incognito mode

3. **Discord Notifications Not Working**:
   - Verify webhook URL is correct
   - Check webhook permissions
   - Test webhook manually
   - Review Discord server settings

4. **Tasks Not Appearing**:
   - Check task status (must be "active")
   - Verify assignedTo field (null = all users)
   - Check user permissions
   - Force sync from admin panel

### Debug Steps
1. **Check Browser Console**: Look for JavaScript errors
2. **Verify Network Requests**: Check if API calls are successful
3. **Test GitHub API**: Use tools like Postman to test endpoints
4. **Check Admin Panel Logs**: Review admin panel for error messages

## 📊 Monitoring and Maintenance

### Regular Tasks
- **Review user activity**: Check tribute and task completion
- **Monitor GitHub repository**: Watch for unauthorized changes
- **Update activation codes**: Generate new codes as needed
- **Backup data**: Regular backups of critical information

### Performance Optimization
- **Sync interval**: Adjust based on usage patterns
- **Repository size**: Monitor repository growth
- **API rate limits**: Stay within GitHub API limits
- **Memory usage**: Monitor extension memory consumption

## 🔮 Future Enhancements

### Planned Features
- **Multi-repository support**: Separate repos for different data types
- **Advanced analytics**: Detailed reporting and insights
- **Mobile app integration**: Sync with mobile applications
- **Third-party integrations**: Connect with other services

### Customization Options
- **Branded admin panel**: Custom themes and branding
- **Advanced task types**: Complex task workflows
- **User role management**: Different access levels
- **Payment integration**: Multiple payment processors

## 📞 Support

### Getting Help
1. **Check documentation**: Review all README files
2. **Search GitHub issues**: Look for similar problems
3. **Browser developer tools**: Use console and network tabs
4. **Test in isolation**: Try features individually

### Reporting Issues
When reporting problems, include:
- Extension version
- Browser version
- GitHub repository URL
- Error messages
- Steps to reproduce

---

## 🎯 Quick Start Checklist

- [ ] GitHub repository created
- [ ] Personal access token generated
- [ ] Extension loaded in Chrome
- [ ] Admin panel accessible
- [ ] GitHub integration configured
- [ ] Discord webhook set up (optional)
- [ ] Test task created and synced
- [ ] User authentication working
- [ ] Tribute system functional
- [ ] Progress tracking active

**🎉 Congratulations!** Your Elite Chambers extension is now fully integrated with GitHub and ready for use!

---

**⚠️ Important**: Keep your GitHub token and Discord webhook URLs secure. Never commit these to public repositories or share them publicly.
