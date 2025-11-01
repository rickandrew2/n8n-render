# Use official n8n image
FROM n8nio/n8n:latest

# Expose port 5678 (Render will map it automatically)
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
