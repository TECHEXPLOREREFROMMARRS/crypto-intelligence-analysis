from apscheduler.schedulers.background import BackgroundScheduler
from app.ingestion.market_collector import collect_market_data
from app.ingestion.whale_scanner import scan_latest_block


def start_scheduler():

    scheduler = BackgroundScheduler()

    scheduler.add_job(collect_market_data, "interval", minutes=1)
    scheduler.add_job(scan_latest_block, "interval", minutes=1)

    scheduler.start()