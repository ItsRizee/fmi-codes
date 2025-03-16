# Use the official MySQL image from Docker Hub
FROM mysql:8.0

# Set environment variables for MySQL root password, database, user, and password
ENV MYSQL_ROOT_PASSWORD=TishkataCodes!2025Root
ENV MYSQL_DATABASE=127.0.0.1
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=TishkataCodes!2025Root

# Expose MySQL default port
EXPOSE 3306

# Optionally, you can copy your custom SQL scripts to initialize the database
# COPY ./init.sql /docker-entrypoint-initdb.d/

# By default, the MySQL Docker image will automatically start the database
