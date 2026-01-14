# Hugging Face Spaces Deployment Guide

This guide will help you deploy your Todo App API backend to Hugging Face Spaces using Docker.

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository
Make sure your repository structure looks like this:

```
your-repo/
├── Dockerfile.hf          # Hugging Face compatible Dockerfile
├── app.py                 # Alternative entry point
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── api/
│   │   ├── models/
│   │   └── schemas/
│   └── main_hf.py         # Hugging Face entry point
└── frontend/              # (Optional, not needed for Hugging Face)
```

### 2. Create a Hugging Face Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Fill in:
   - **Name**: Choose a name (e.g., "todo-app-api")
   - **License**: MIT (or your preference)
   - **Space SDK**: **Docker** (This is important!)
   - **Hardware**: Start with "CPU basic" (upgrade later if needed)
   - **Public/Private**: Your choice

### 3. Configure Environment Variables

In your Space settings, go to **"Variables and secrets"** and add these:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `DB_PASSWORD` | Database password | `secure_password_123` |
| `JWT_SECRET` | JWT signing key | `your_super_secret_key` |
| `BETTER_AUTH_SECRET` | Better Auth secret | `another_secret_key` |
| `ENVIRONMENT` | Environment type | `production` |

**⚠️ SECURITY**: Use strong, unique secrets for each variable.

### 4. Upload Files

Upload the following files to your Space:

- `Dockerfile.hf` (rename to `Dockerfile` when uploading)
- `backend/` directory with all its contents
- `app.py` (optional, for compatibility)

### 5. Rename Dockerfile

Hugging Face Spaces expects a file named `Dockerfile` (without extension). Either:
- Rename `Dockerfile.hf` to `Dockerfile` before uploading
- Or upload it as `Dockerfile`

### 6. Wait for Build

Hugging Face will automatically:
1. Build your Docker image
2. Install dependencies
3. Start your application
4. Run health checks

You can monitor the progress in the **"Logs"** tab.

## 🔧 Alternative Deployment Methods

### Method 1: Using Hugging Face CLI

```bash
# Install Hugging Face CLI
pip install huggingface_hub

# Login
huggingface-cli login

# Create space
huggingface-cli space create your-space-name --sdk docker

# Upload files
cd your-repo
huggingface-cli upload your-username/your-space-name . .
```

### Method 2: Using Git (Recommended)

```bash
# Clone your space (after creating it)
git clone https://huggingface.co/spaces/your-username/your-space-name
cd your-space-name

# Copy your files
cp /path/to/your/project/Dockerfile.hf ./Dockerfile
cp -r /path/to/your/project/backend .

# Commit and push
git add .
git commit -m "Add Todo App API"
git push origin main
```

## 🔍 Verify Deployment

Once deployed, you should see:

1. **"Build" status** → **"Running" status**
2. A public URL like: `https://your-username-your-space-name.hf.space`
3. API documentation at: `https://your-username-your-space-name.hf.space/docs`
4. Health check at: `https://your-username-your-space-name.hf.space/health`

## 📝 Test Your API

```bash
# Replace with your actual Space URL
SPACE_URL="https://your-username-your-space-name.hf.space"

# Test health endpoint
curl $SPACE_URL/health

# Test API docs
curl $SPACE_URL/docs

# Test registration (example)
curl -X POST $SPACE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

## 🛠️ Troubleshooting

### Build Fails
- Check logs in the **"Logs"** tab
- Ensure all files are uploaded correctly
- Verify `Dockerfile` is named correctly (no extension)
- Check that `backend/requirements.txt` includes all dependencies

### App Crashes on Startup
- **Environment variables not set**: Check Space settings
- **Database connection issues**: Hugging Face Spaces don't have built-in PostgreSQL
  - Use external database (Neon, Supabase, Railway)
  - Or use SQLite for testing (but not production)

### Port Issues
- Hugging Face Spaces automatically handle port exposure
- Your app must listen on `PORT` environment variable
- The Dockerfile already handles this

## 🗄️ Database Options for Hugging Face

Since Hugging Face Spaces don't have built-in databases, you have these options:

### Option 1: External PostgreSQL (Recommended)
Use services like:
- **Neon** (serverless PostgreSQL)
- **Supabase** (PostgreSQL + auth)
- **Railway** (PostgreSQL)
- **Aiven** (PostgreSQL)

Update your `DATABASE_URL` environment variable:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### Option 2: SQLite (For testing only)
Modify your backend to use SQLite:

```python
# In backend/app/database.py
DATABASE_URL = "sqlite:///./todo_app.db"
```

Update the Dockerfile to persist the database file.

### Option 3: Use Hugging Face Inference Endpoints
For production, consider Hugging Face Inference Endpoints which support databases.

## 🚀 Production Considerations

### Performance
- Upgrade hardware in Space settings (CPU → GPU if needed)
- Optimize Docker image size
- Use connection pooling

### Security
- Use strong environment variable secrets
- Enable authentication in your API
- Consider rate limiting

### Monitoring
- Check logs regularly
- Set up health monitoring
- Monitor API usage

### Cost Management
- CPU basic is free for limited usage
- Upgrade hardware as needed
- Consider alternatives for heavy usage

## 📋 Checklist Before Deployment

- [ ] All backend files are present and correct
- [ ] `Dockerfile.hf` renamed to `Dockerfile`
- [ ] `backend/requirements.txt` has all dependencies
- [ ] Environment variables configured in Space settings
- [ ] Database connection string is set (if using external DB)
- [ ] Repository structure is correct
- [ ] Space SDK set to **Docker**

## 🎯 Expected Space Structure

After deployment, your Space should have this structure:

```
Space Root/
├── Dockerfile              # Renamed from Dockerfile.hf
├── app.py                  # Optional compatibility wrapper
├── backend/
│   ├── requirements.txt
│   ├── main_hf.py          # Hugging Face entry point
│   └── app/
│       ├── main.py         # Your FastAPI app
│       ├── database.py
│       ├── config.py
│       └── ...
```

## 🆘 Need Help?

If deployment fails:
1. Check the **Logs** tab in your Space
2. Verify environment variables are set
3. Ensure all files are uploaded correctly
4. Try rebuilding manually in Space settings

**Remember**: Hugging Face Spaces are primarily for ML models, but they work great for APIs too! Just be mindful of the limitations and use external services for databases in production.