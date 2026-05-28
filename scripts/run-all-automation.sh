#!/bin/bash
#===============================================================================
# run-all-automation.sh - Master Automation Control Script
# 
# Comprehensive automation for useaitools.me including:
# - pSEO content generation
# - Reddit engagement
# - Backlink monitoring
# - Competitor analysis
# - Content production
#===============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/.tmp/logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$LOG_DIR/automation_${TIMESTAMP}.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

#-------------------------------------------------------------------------------
# Helper Functions
#-------------------------------------------------------------------------------

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$LOG_FILE"
}

log_section() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

run_task() {
    local task_name="$1"
    local task_cmd="$2"
    local max_retries="${3:-1}"
    
    log "Starting: $task_name"
    
    local attempt=1
    while [ $attempt -le $max_retries ]; do
        if [ $attempt -gt 1 ]; then
            log_warn "Retry attempt $attempt for: $task_name"
            sleep 5
        fi
        
        if eval "$task_cmd" >> "$LOG_FILE" 2>&1; then
            log "✓ Completed: $task_name"
            return 0
        else
            log_error "✗ Failed: $task_name (attempt $attempt/$max_retries)"
            attempt=$((attempt + 1))
        fi
    done
    
    return 1
}

#-------------------------------------------------------------------------------
# Pre-flight Checks
#-------------------------------------------------------------------------------

preflight_check() {
    log_section "PRE-FLIGHT CHECK"
    
    # Check Node.js
    if check_command node; then
        log "✓ Node.js: $(node --version)"
    else
        log_error "✗ Node.js not found"
        return 1
    fi
    
    # Check npm
    if check_command npm; then
        log "✓ npm: $(npm --version)"
    else
        log_error "✗ npm not found"
        return 1
    fi
    
    # Check Python (for Reddit script)
    if check_command python3; then
        log "✓ Python3: $(python3 --version)"
    else
        log_warn "⚠ Python3 not found - some scripts may not work"
    fi
    
    # Check data directory
    if [ -d "$PROJECT_DIR/data" ]; then
        log "✓ Data directory exists"
    else
        log_error "✗ Data directory not found"
        return 1
    fi
    
    # Check required data files
    if [ -f "$PROJECT_DIR/data/tools.json" ]; then
        local tool_count=$(node -e "console.log(require('$PROJECT_DIR/data/tools.json').length)")
        log "✓ tools.json: $tool_count tools"
    else
        log_error "✗ tools.json not found"
        return 1
    fi
    
    if [ -f "$PROJECT_DIR/data/blog-index.json" ]; then
        log "✓ blog-index.json exists"
    else
        log_warn "⚠ blog-index.json not found"
    fi
    
    log "✓ Pre-flight checks passed"
    return 0
}

#-------------------------------------------------------------------------------
# Task 1: pSEO Content Generation
#-------------------------------------------------------------------------------

run_pseo_content() {
    log_section "TASK 1: pSEO CONTENT GENERATION"
    
    local pseo_script="$SCRIPT_DIR/pseo-content-producer.js"
    
    if [ ! -f "$pseo_script" ]; then
        log_error "pSEO script not found: $pseo_script"
        return 1
    fi
    
    if run_task "Generate pSEO content" "cd '$PROJECT_DIR' && node '$pseo_script'" 3; then
        log "✓ pSEO content generation complete"
        return 0
    else
        log_error "✗ pSEO content generation failed"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# Task 2: Reddit Engagement
#-------------------------------------------------------------------------------

run_reddit_engagement() {
    log_section "TASK 2: REDDIT ENGAGEMENT"
    
    local reddit_script="$SCRIPT_DIR/auto-reddit-engage.py"
    
    if [ ! -f "$reddit_script" ]; then
        log_error "Reddit script not found: $reddit_script"
        return 1
    fi
    
    if check_command python3; then
        if run_task "Generate Reddit reply drafts" "python3 '$reddit_script' --count 5" 3; then
            log "✓ Reddit engagement complete"
            return 0
        else
            log_error "✗ Reddit engagement failed"
            return 1
        fi
    else
        log_warn "⚠ Python3 not available - skipping Reddit engagement"
        return 0
    fi
}

#-------------------------------------------------------------------------------
# Task 3: Backlink Monitoring
#-------------------------------------------------------------------------------

run_backlink_monitor() {
    log_section "TASK 3: BACKLINK MONITORING"
    
    local backlink_script="$SCRIPT_DIR/auto-backlinks.js"
    
    if [ ! -f "$backlink_script" ]; then
        log_error "Backlink script not found: $backlink_script"
        return 1
    fi
    
    if run_task "Monitor brand mentions and backlinks" "node '$backlink_script'" 3; then
        log "✓ Backlink monitoring complete"
        return 0
    else
        log_error "✗ Backlink monitoring failed"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# Task 4: Competitor Backlink Analysis
#-------------------------------------------------------------------------------

run_competitor_analysis() {
    log_section "TASK 4: COMPETITOR BACKLINK ANALYSIS"
    
    local competitor_script="$SCRIPT_DIR/competitor-backlink-watch.py"
    
    if [ ! -f "$competitor_script" ]; then
        log_error "Competitor script not found: $competitor_script"
        return 1
    fi
    
    if check_command python3; then
        if run_task "Analyze competitor backlinks" "python3 '$competitor_script'" 3; then
            log "✓ Competitor analysis complete"
            return 0
        else
            log_error "✗ Competitor analysis failed"
            return 1
        fi
    else
        log_warn "⚠ Python3 not available - skipping competitor analysis"
        return 0
    fi
}

#-------------------------------------------------------------------------------
# Task 5: Batch Content Production
#-------------------------------------------------------------------------------

run_batch_content() {
    log_section "TASK 5: BATCH CONTENT PRODUCTION"
    
    local batch_script="$SCRIPT_DIR/batch-content-producer.js"
    
    if [ ! -f "$batch_script" ]; then
        log_warn "⚠ Batch content script not found: $batch_script"
        return 0
    fi
    
    if run_task "Generate batch content" "cd '$PROJECT_DIR' && node '$batch_script'" 3; then
        log "✓ Batch content production complete"
        return 0
    else
        log_error "✗ Batch content production failed"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# Task 6: Internal Links
#-------------------------------------------------------------------------------

run_internal_links() {
    log_section "TASK 6: INTERNAL LINKS UPDATE"
    
    local links_script="$SCRIPT_DIR/add-internal-links.py"
    
    if [ ! -f "$links_script" ]; then
        log_warn "⚠ Internal links script not found"
        return 0
    fi
    
    if check_command python3; then
        if run_task "Add internal links" "python3 '$links_script'" 3; then
            log "✓ Internal links update complete"
            return 0
        else
            log_warn "⚠ Internal links update failed - continuing"
            return 0
        fi
    else
        log_warn "⚠ Python3 not available - skipping internal links"
        return 0
    fi
}

#-------------------------------------------------------------------------------
# Task 7: Affiliate Links Check
#-------------------------------------------------------------------------------

run_affiliate_check() {
    log_section "TASK 7: AFFILIATE LINKS CHECK"
    
    local affiliate_script="$SCRIPT_DIR/update-affiliate-links.js"
    
    if [ ! -f "$affiliate_script" ]; then
        log_warn "⚠ Affiliate script not found"
        return 0
    fi
    
    if run_task "Update affiliate links" "cd '$PROJECT_DIR' && node '$affiliate_script'" 3; then
        log "✓ Affiliate links check complete"
        return 0
    else
        log_warn "⚠ Affiliate links check failed - continuing"
        return 0
    fi
}

#-------------------------------------------------------------------------------
# Task 8: External URL Validation
#-------------------------------------------------------------------------------

run_url_check() {
    log_section "TASK 8: EXTERNAL URL VALIDATION"
    
    local url_script="$SCRIPT_DIR/check-external-urls.js"
    
    if [ ! -f "$url_script" ]; then
        log_warn "⚠ URL check script not found"
        return 0
    fi
    
    if run_task "Validate external URLs" "cd '$PROJECT_DIR' && node '$url_script'" 3; then
        log "✓ External URL validation complete"
        return 0
    else
        log_warn "⚠ External URL validation failed - continuing"
        return 0
    fi
}

#-------------------------------------------------------------------------------
# Summary Report
#-------------------------------------------------------------------------------

generate_summary() {
    log_section "AUTOMATION SUMMARY"
    
    echo "Generated Files:"
    echo "----------------"
    
    if [ -d "$PROJECT_DIR/.tmp" ]; then
        if [ -f "$PROJECT_DIR/.tmp/reddit-replies.md" ]; then
            echo "  ✓ Reddit replies: .tmp/reddit-replies.md"
        fi
        
        if [ -f "$PROJECT_DIR/.tmp/brand-mentions.json" ]; then
            echo "  ✓ Brand mentions: .tmp/brand-mentions.json"
        fi
        
        if [ -f "$PROJECT_DIR/.tmp/backlinks-report.md" ]; then
            echo "  ✓ Backlinks report: .tmp/backlinks-report.md"
        fi
        
        if [ -f "$PROJECT_DIR/.tmp/competitor-backlink-report.md" ]; then
            echo "  ✓ Competitor report: .tmp/competitor-backlink-report.md"
        fi
        
        if [ -d "$PROJECT_DIR/data/pseo-content" ]; then
            local pseo_count=$(find "$PROJECT_DIR/data/pseo-content" -name "*.json" 2>/dev/null | wc -l)
            echo "  ✓ pSEO content: data/pseo-content/ ($pseo_count files)"
        fi
    fi
    
    echo ""
    echo "Log file: $LOG_FILE"
    echo ""
}

#-------------------------------------------------------------------------------
# Main Execution
#-------------------------------------------------------------------------------

main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║     useaitools.me - Master Automation Script          ║"
    echo "║     Started: $(date +'%Y-%m-%d %H:%M:%S')                 ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    
    # Run pre-flight checks
    if ! preflight_check; then
        log_error "Pre-flight checks failed - aborting"
        exit 1
    fi
    
    # Define which tasks to run
    RUN_PSEO=true
    RUN_REDDIT=true
    RUN_BACKLINKS=true
    RUN_COMPETITOR=true
    RUN_BATCH=true
    RUN_LINKS=true
    RUN_AFFILIATE=true
    RUN_URL_CHECK=true
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --pseo-only)
                RUN_PSEO=true
                RUN_REDDIT=false
                RUN_BACKLINKS=false
                RUN_COMPETITOR=false
                RUN_BATCH=false
                RUN_LINKS=false
                RUN_AFFILIATE=false
                RUN_URL_CHECK=false
                shift
                ;;
            --reddit-only)
                RUN_PSEO=false
                RUN_REDDIT=true
                RUN_BACKLINKS=false
                RUN_COMPETITOR=false
                shift
                ;;
            --backlinks-only)
                RUN_PSEO=false
                RUN_REDDIT=false
                RUN_BACKLINKS=true
                RUN_COMPETITOR=false
                shift
                ;;
            --competitor-only)
                RUN_PSEO=false
                RUN_REDDIT=false
                RUN_BACKLINKS=false
                RUN_COMPETITOR=true
                shift
                ;;
            --skip-pseo)
                RUN_PSEO=false
                shift
                ;;
            --skip-reddit)
                RUN_REDDIT=false
                shift
                ;;
            --skip-backlinks)
                RUN_BACKLINKS=false
                RUN_COMPETITOR=false
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --pseo-only       Run only pSEO content generation"
                echo "  --reddit-only     Run only Reddit engagement"
                echo "  --backlinks-only  Run only backlink monitoring"
                echo "  --competitor-only Run only competitor analysis"
                echo "  --skip-pseo       Skip pSEO content generation"
                echo "  --skip-reddit     Skip Reddit engagement"
                echo "  --skip-backlinks  Skip backlink monitoring and analysis"
                echo "  --help            Show this help message"
                echo ""
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Track failures
    local failed_tasks=()
    
    # Run tasks in order
    if [ "$RUN_PSEO" = true ]; then
        if ! run_pseo_content; then
            failed_tasks+=("pSEO Content")
        fi
    fi
    
    if [ "$RUN_REDDIT" = true ]; then
        if ! run_reddit_engagement; then
            failed_tasks+=("Reddit Engagement")
        fi
    fi
    
    if [ "$RUN_BACKLINKS" = true ]; then
        if ! run_backlink_monitor; then
            failed_tasks+=("Backlink Monitoring")
        fi
    fi
    
    if [ "$RUN_COMPETITOR" = true ]; then
        if ! run_competitor_analysis; then
            failed_tasks+=("Competitor Analysis")
        fi
    fi
    
    if [ "$RUN_BATCH" = true ]; then
        if ! run_batch_content; then
            failed_tasks+=("Batch Content")
        fi
    fi
    
    if [ "$RUN_LINKS" = true ]; then
        if ! run_internal_links; then
            failed_tasks+=("Internal Links")
        fi
    fi
    
    if [ "$RUN_AFFILIATE" = true ]; then
        if ! run_affiliate_check; then
            failed_tasks+=("Affiliate Check")
        fi
    fi
    
    if [ "$RUN_URL_CHECK" = true ]; then
        if ! run_url_check; then
            failed_tasks+=("URL Check")
        fi
    fi
    
    # Generate summary
    generate_summary
    
    # Final status
    echo ""
    if [ ${#failed_tasks[@]} -eq 0 ]; then
        echo "╔════════════════════════════════════════════════════════╗"
        echo "║  ✓ ALL TASKS COMPLETED SUCCESSFULLY                    ║"
        echo "║  Finished: $(date +'%Y-%m-%d %H:%M:%S')                   ║"
        echo "╚════════════════════════════════════════════════════════╝"
        exit 0
    else
        echo "╔════════════════════════════════════════════════════════╗"
        echo "║  ⚠ SOME TASKS FAILED                                  ║"
        echo "║  Failed: ${failed_tasks[*]}                               ║"
        echo "║  Finished: $(date +'%Y-%m-%d %H:%M:%S')                   ║"
        echo "╚════════════════════════════════════════════════════════╝"
        exit 1
    fi
}

# Run main function
main "$@"
