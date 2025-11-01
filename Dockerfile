# Official n8n Docker image from n8n's registry
FROM docker.n8n.io/n8nio/n8n:latest

# Expose port 5678
EXPOSE 5678

# The image has a default entrypoint that runs n8n correctly
# No need to override CMD - let the image use its default

