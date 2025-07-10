#!/bin/bash

# Beautiful Flip Clock - Production Docker Script
# このスクリプトは本番環境でのDocker Composeを管理するためのものです

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
}

# Function to start production environment
start_prod() {
    print_status "Starting Beautiful Flip Clock production environment..."
    check_docker
    check_docker_compose
    
    # Build and start the production container
    docker-compose up --build -d
    
    print_success "Production environment started successfully!"
    print_status "Application is running at: http://localhost"
    print_status "Network access: http://[your-ip]"
    print_status ""
    print_status "To view logs: ./scripts/docker-prod.sh logs"
    print_status "To stop: ./scripts/docker-prod.sh stop"
}

# Function to stop production environment
stop_prod() {
    print_status "Stopping production environment..."
    docker-compose down
    print_success "Production environment stopped."
}

# Function to restart production environment
restart_prod() {
    print_status "Restarting production environment..."
    stop_prod
    start_prod
}

# Function to view logs
show_logs() {
    print_status "Showing production environment logs..."
    docker-compose logs -f
}

# Function to show status
show_status() {
    print_status "Production environment status:"
    docker-compose ps
}

# Function to update application
update() {
    print_status "Updating production application..."
    
    # Pull latest changes (if using git)
    if [ -d ".git" ]; then
        print_status "Pulling latest changes from git..."
        git pull
    fi
    
    # Rebuild and restart
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    
    print_success "Application updated successfully!"
}

# Function to backup (if needed)
backup() {
    print_status "Creating backup..."
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Export container if running
    if docker-compose ps | grep -q "Up"; then
        docker-compose exec flip-clock tar -czf /tmp/backup.tar.gz /usr/share/nginx/html
        docker cp $(docker-compose ps -q flip-clock):/tmp/backup.tar.gz "$BACKUP_DIR/"
    fi
    
    print_success "Backup created in $BACKUP_DIR"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up production environment..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed."
}

# Function to show health status
health() {
    print_status "Checking application health..."
    
    if docker-compose ps | grep -q "Up"; then
        # Check health endpoint
        if curl -f http://localhost/health > /dev/null 2>&1; then
            print_success "Application is healthy!"
        else
            print_warning "Application is running but health check failed."
        fi
    else
        print_error "Application is not running."
    fi
}

# Function to show help
show_help() {
    echo "Beautiful Flip Clock - Production Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start the production environment"
    echo "  stop      Stop the production environment"
    echo "  restart   Restart the production environment"
    echo "  logs      Show application logs"
    echo "  status    Show container status"
    echo "  update    Update application (pull + rebuild)"
    echo "  backup    Create application backup"
    echo "  health    Check application health"
    echo "  cleanup   Clean up containers and images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start production environment"
    echo "  $0 logs           # View real-time logs"
    echo "  $0 health         # Check if app is healthy"
    echo "  $0 update         # Update to latest version"
    echo ""
}

# Main script logic
case "${1:-}" in
    start)
        start_prod
        ;;
    stop)
        stop_prod
        ;;
    restart)
        restart_prod
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    update)
        update
        ;;
    backup)
        backup
        ;;
    health)
        health
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        print_warning "No command specified. Use 'help' to see available commands."
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac