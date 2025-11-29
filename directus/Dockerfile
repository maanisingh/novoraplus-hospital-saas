FROM directus/directus:11

# Copy extensions if any
COPY extensions /directus/extensions

# Expose Directus default port
EXPOSE 8055

# Start Directus
CMD ["node", "/directus/cli.js", "start"]
