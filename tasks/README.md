# Tasks Directory

This directory contains all task definitions for the Elite Chambers extension.

## File Structure
- `task-[id].json` - Individual task definitions
- Task files are automatically synced with the admin panel

## Task Schema
```json
{
  "id": "task_123",
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

## Task Types
- **Daily Tasks**: Recurring tasks that reset daily
- **Weekly Tasks**: Recurring tasks that reset weekly
- **Special Tasks**: One-time or event-based tasks
- **Punishment Tasks**: Tasks assigned for rule violations

## Admin Control
- Tasks are managed through the admin panel
- Tasks can be assigned to specific users or all users
- Task completion requires admin approval
- Points are awarded upon task completion
