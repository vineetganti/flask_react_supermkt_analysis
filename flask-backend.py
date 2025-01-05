from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Load and prepare the data
def load_data():
    df = pd.read_csv('supermarket_sales  Sheet1.csv')
    # Convert date to datetime
    df['Date'] = pd.to_datetime(df['Date'])
    return df

# Initialize data
df = load_data()

def apply_filters(df):
    """Apply filters based on request parameters"""
    filtered_df = df.copy()
    
    # Branch filter
    branch = request.args.get('branch')
    if branch and branch != 'all':
        filtered_df = filtered_df[filtered_df['Branch'] == branch]
    
    # Product line filter
    product_line = request.args.get('product_line')
    if product_line and product_line != 'all':
        filtered_df = filtered_df[filtered_df['Product line'] == product_line]
    
    # Customer type filter
    customer_type = request.args.get('customer_type')
    if customer_type and customer_type != 'all':
        filtered_df = filtered_df[filtered_df['Customer type'] == customer_type]
    
    # Date range filter
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    
    if date_from:
        filtered_df = filtered_df[filtered_df['Date'] >= date_from]
    if date_to:
        filtered_df = filtered_df[filtered_df['Date'] <= date_to]
    
    return filtered_df

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get overall summary statistics with filters"""
    filtered_df = apply_filters(df)
    summary = {
        'total_sales': float(filtered_df['Total'].sum()),
        'average_rating': float(filtered_df['Rating'].mean()),
        'total_customers': len(filtered_df),
        'product_lines': len(filtered_df['Product line'].unique())
    }
    return jsonify(summary)

@app.route('/api/sales-by-branch', methods=['GET'])
def get_sales_by_branch():
    """Get sales data grouped by branch with filters"""
    filtered_df = apply_filters(df)
    branch_sales = filtered_df.groupby('Branch')['Total'].sum().to_dict()
    return jsonify(branch_sales)

@app.route('/api/sales-by-product-line', methods=['GET'])
def get_sales_by_product_line():
    """Get sales data grouped by product line with filters"""
    filtered_df = apply_filters(df)
    product_sales = filtered_df.groupby('Product line')['Total'].sum().to_dict()
    return jsonify(product_sales)

@app.route('/api/sales-by-payment', methods=['GET'])
def get_sales_by_payment():
    """Get sales data grouped by payment method with filters"""
    filtered_df = apply_filters(df)
    payment_sales = filtered_df.groupby('Payment')['Total'].sum().to_dict()
    return jsonify(payment_sales)

@app.route('/api/customer-demographics', methods=['GET'])
def get_customer_demographics():
    """Get customer demographic information with filters"""
    filtered_df = apply_filters(df)
    demographics = {
        'gender': filtered_df['Gender'].value_counts().to_dict(),
        'customer_type': filtered_df['Customer type'].value_counts().to_dict()
    }
    return jsonify(demographics)

@app.route('/api/sales-over-time', methods=['GET'])
def get_sales_over_time():
    """Get daily sales data over time with filters"""
    filtered_df = apply_filters(df)
    daily_sales = filtered_df.groupby('Date')['Total'].sum().reset_index()
    daily_sales['Date'] = daily_sales['Date'].dt.strftime('%Y-%m-%d')
    return jsonify(daily_sales.to_dict(orient='records'))

@app.route('/api/ratings-analysis', methods=['GET'])
def get_ratings_analysis():
    """Get analysis of customer ratings with filters"""
    filtered_df = apply_filters(df)
    ratings = {
        'average_by_branch': filtered_df.groupby('Branch')['Rating'].mean().to_dict(),
        'average_by_product': filtered_df.groupby('Product line')['Rating'].mean().to_dict(),
        'rating_distribution': filtered_df['Rating'].value_counts().sort_index().to_dict()
    }
    return jsonify(ratings)

@app.route('/api/time-analysis', methods=['GET'])
def get_time_analysis():
    """Get sales analysis by time of day with filters"""
    filtered_df = apply_filters(df)
    filtered_df['Hour'] = pd.to_datetime(filtered_df['Time']).dt.hour
    hourly_sales = filtered_df.groupby('Hour')['Total'].sum().to_dict()
    return jsonify(hourly_sales)

@app.route('/api/product-performance', methods=['GET'])
def get_product_performance():
    """Get detailed product line performance metrics with filters"""
    filtered_df = apply_filters(df)
    performance = filtered_df.groupby('Product line').agg({
        'Total': 'sum',
        'Quantity': 'sum',
        'gross income': 'sum',
        'Rating': 'mean'
    }).round(2).to_dict(orient='index')
    return jsonify(performance)

@app.route('/api/branch-comparison', methods=['GET'])
def get_branch_comparison():
    """Get detailed branch comparison metrics with filters"""
    filtered_df = apply_filters(df)
    comparison = filtered_df.groupby('Branch').agg({
        'Total': 'sum',
        'Rating': 'mean',
        'gross income': 'sum',
        'Quantity': 'sum'
    }).round(2).to_dict(orient='index')
    return jsonify(comparison)

@app.route('/api/customer-segments', methods=['GET'])
def get_customer_segments():
    """Get customer segment analysis with filters"""
    filtered_df = apply_filters(df)
    segments = filtered_df.groupby(['Customer type', 'Gender']).agg({
        'Total': 'sum',
        'Rating': 'mean',
        'Quantity': 'sum'
    }).round(2).to_dict(orient='index')
    return jsonify(segments)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
