#!/bin/bash

# Beautiful Flip Clock - Development Docker Script
# このスクリプトは開発環境でのDocker Composeを簡単に管理するためのものです

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

# Function to start development environment
start_dev() {
    print_status "Starting Beautiful Flip Clock development environment..."
    check_docker
    check_docker_compose
    
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_success "Development environment started successfully!"
    print_status "Application is running at: http://localhost:5173"
    print_status "Network access: http://[your-ip]:5173"
    print_status ""
    print_status "To view logs: ./scripts/docker-dev.sh logs"
    print_status "To stop: ./scripts/docker-dev.sh stop"
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped."
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    stop_dev
    start_dev
}

# Function to view logs
show_logs() {
    print_status "Showing development environment logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Function to show status
show_status() {
    print_status "Development environment status:"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to clean up
cleanup() {
    print_status "Cleaning up development environment..."
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed."
}

# Function to enter container shell
shell() {
    print_status "Entering development container shell..."
    docker-compose -f docker-compose.dev.yml exec flip-clock-dev sh
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies in development container..."
    docker-compose -f docker-compose.dev.yml exec flip-clock-dev npm install
    print_success "Dependencies installed."
}

# Function to show help
show_help() {
    echo "Beautiful Flip Clock - Development Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start the development environment"
    echo "  stop      Stop the development environment"
    echo "  restart   Restart the development environment"
    echo "  logs      Show application logs"
    echo "  status    Show container status"
    echo "  shell     Enter container shell"
    echo "  install   Install npm dependencies"
    echo "  cleanup   Clean up containers and images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start development environment"
    echo "  $0 logs           # View real-time logs"
    echo "  $0 shell          # Enter container for debugging"
    echo ""
}

# Main script logic
case "${1:-}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    shell)
        shell
        ;;
    install)
        install_deps
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