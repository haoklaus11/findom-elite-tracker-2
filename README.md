# 👑 Elite Chambers - Findom Extension with GitHub Integration

A comprehensive Chrome extension for findom/femdom communities with full GitHub-based administration and task management.

## 🚀 Features

### Core Extension Features
- **Secure Authentication System** with persistent sessions
- **Tribute Payment Integration** with Throne.com
- **Task Management System** with progress tracking
- **Discord Integration** for real-time notifications
- **Obedience Level Tracking** with progressive rewards
- **Proof Submission System** with file upload support

### Admin Panel Features
- **Complete Task Management** - Create, assign, approve/deny tasks
- **User Management** - View users, track progress, manage access
- **Activation Code Generation** - Create time-limited access codes
- **Tribute Tracking** - Monitor all tribute submissions
- **GitHub Integration** - Sync all data with GitHub repository
- **Discord Webhook Management** - Configure notifications

### GitHub Integration
- **Automatic Synchronization** of tasks, users, and configurations
- **Admin Control** over all aspects through GitHub repository
- **Task Assignment** to specific users or all users
- **Activation Code Management** through GitHub
- **Real-time Updates** between extension and GitHub
- **Backup and Version Control** of all data

## 📁 Repository Structure

```
findom-elite-tracker-2/
├── src/
│   ├── admin/
│   │   ├── admin-panel.html      # Admin interface
│   │   ├── admin-panel.css       # Admin styling
│   │   ├── admin-panel.js        # Admin functionality
│   │   ├── admin-login.html      # Admin authentication
│   │   └── github-integration.js # GitHub API integration
│   ├── background/
│   │   └── background.js         # Service worker
│   ├── common/
│   │   ├── github-sync.js        # Client-side GitHub sync
│   │   ├── memory-leak-monitor.js
│   │   └── storage-health-monitor.js
│   ├── content/
│   │   └── content.js            # Content script
│   ├── popup/
│   │   ├── popup-spicy-enhanced.html
│   │   ├── popup-spicy-enhanced.css
│   │   └── popup-spicy-enhanced.js
│   └── options/
│       ├── options.html
│       ├── options.css
│       └── options.js
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
│   └── admin-config.json
├── users/                        # User data (auto-generated)
├── tributes/                     # Tribute records (auto-generated)
├── submissions/                  # Task submissions (auto-generated)
└── manifest.json
```

## 🛠️ Installation & Setup

### Extension Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the repository folder
5. The extension will be loaded and ready to use

### GitHub Integration Setup
1. Create a new GitHub repository for your extension data
2. Generate a GitHub Personal Access Token with `repo` permissions
3. Access the admin panel at `src/admin/admin-login.html`
4. Default admin credentials: `goddess` / `elite2024`
5. Configure GitHub settings in the admin panel:
   - Repository: `username/repository-name`
   - Token: Your GitHub personal access token
   - Sync interval: 15 minutes (recommended)

### Discord Integration Setup
1. Create a Discord webhook in your server
2. Copy the webhook URL
3. Configure in admin panel settings
4. Enable notifications for tributes, tasks, and user activity

## 🔧 Configuration

### Admin Panel Access
- **URL**: `src/admin/admin-login.html`
- **Default Username**: `goddess`
- **Default Password**: `elite2024`
- **Session Duration**: 24 hours

### GitHub Configuration
The extension uses GitHub as a backend for:
- Task definitions and assignments
- User data and progress tracking
- Activation code management
- Configuration synchronization

### Task Management
Tasks are stored in `/tasks/` as JSON files:
```json
{
  "id": "task_unique_id",
  "title": "Task Title",
  "description": "Task description",
  "difficulty": "easy|medium|hard|extreme",
  "points": 25,
  "deadline": 24,
  "status": "active|pending|completed",
  "assignedTo": "user_id or null",
  "createdAt": "ISO timestamp",
  "completedBy": []
}
```

## 🎯 Usage

### For Users
1. Install the extension
2. Use activation code to gain access
3. Complete login with username and access code
4. Submit tributes using the tribute buttons
5. Complete assigned tasks
6. Submit proof of completion
7. Track progress and obedience level

### For Admins
1. Access admin panel through `admin-login.html`
2. Create and manage tasks
3. Monitor user activity and progress
4. Generate activation codes
5. Approve/deny task completions
6. Configure GitHub and Discord integration
7. Monitor tribute submissions

## 🔐 Security Features

- **Secure Authentication** with session management
- **Admin-only Access** to management features
- **GitHub Token Security** with proper permissions
- **User Data Protection** with encrypted storage
- **Activity Logging** for security monitoring

## 📊 Admin Features

### Task Management
- Create tasks with different difficulty levels
- Assign tasks to specific users or all users
- Set deadlines and point rewards
- Approve or deny task completions
- Track completion statistics

### User Management
- View all registered users
- Monitor user activity and progress
- Track tribute submissions
- Manage user access levels
- Generate user statistics

### Code Generation
- Create activation codes with expiration dates
- Set usage limits per code
- Track code usage
- Manage code types (standard, premium, VIP)

### GitHub Integration
- Automatic synchronization of all data
- Real-time updates between extension and GitHub
- Version control for all configurations
- Backup and restore capabilities

## 🌐 API Integration

### GitHub API
- **Authentication**: Personal access token
- **Permissions**: Repository read/write access
- **Rate Limits**: Respects GitHub API limits
- **Error Handling**: Comprehensive error management

### Discord Webhooks
- **Tribute Notifications**: Real-time tribute alerts
- **Task Completion**: Task completion notifications
- **User Activity**: New user registrations
- **System Alerts**: Error and system notifications

## 🔄 Synchronization

### Automatic Sync
- **Interval**: Configurable (default: 15 minutes)
- **Data Types**: Tasks, users, configurations, tributes
- **Conflict Resolution**: GitHub takes precedence
- **Offline Support**: Local cache with sync on reconnect

### Manual Sync
- **Admin Trigger**: Sync button in admin panel
- **User Trigger**: Sync Empire button in extension
- **Force Sync**: Override local data with GitHub
- **Backup Creation**: Automatic backups before sync

## 📈 Analytics & Reporting

### User Analytics
- Tribute submission tracking
- Task completion rates
- Obedience level progression
- Activity patterns and streaks

### System Analytics
- Extension usage statistics
- GitHub sync performance
- Discord notification delivery
- Error rates and system health

## 🛡️ Data Privacy

- **Local Storage**: Sensitive data stored locally
- **GitHub Storage**: Non-sensitive configuration data
- **Discord Integration**: Configurable notification levels
- **User Control**: Users can delete their data anytime

## 🔧 Development

### Local Development
1. Clone the repository
2. Make changes to the source files
3. Test in Chrome developer mode
4. Use admin panel for testing configurations

### GitHub Integration Testing
1. Set up test repository
2. Configure GitHub token
3. Test sync functionality
4. Verify data integrity

### Discord Integration Testing
1. Create test Discord server
2. Set up webhook
3. Test notification delivery
4. Verify message formatting

## 📞 Support

For issues or questions:
1. Check the admin panel logs
2. Verify GitHub integration settings
3. Test Discord webhook configuration
4. Review browser console for errors

## 🚀 Advanced Features

### Custom Task Types
- Create custom task categories
- Set recurring task schedules
- Configure automatic task generation
- Implement task dependencies

### Advanced User Management
- User role management
- Custom access levels
- User group assignments
- Bulk user operations

### Integration Extensions
- Custom webhook endpoints
- Third-party payment processors
- Additional notification channels
- External API integrations

## 🔮 Future Enhancements

- Mobile app integration
- Advanced analytics dashboard
- Multi-language support
- Custom theme system
- Enhanced security features

---

**⚠️ Important**: This extension is designed for consenting adults in findom/femdom communities. Please use responsibly and ensure all participants are of legal age and consent to participation.

**🔒 Security Notice**: Keep your GitHub token and Discord webhook URLs secure. Never share these credentials publicly.