# flask_react_supermkt_analysis
A full-stack web application that provides real-time visualization and analysis of sales data across multiple supermarket branches. Built with Flask and React, it features interactive charts, comprehensive filtering capabilities, and key performance metrics. 

## Features

### Data Visualization
- Sales trends over time
- Branch-wise sales comparison
- Product line performance
- Customer demographics
- Payment method distribution
- Rating analysis

### Interactive Filtering
- Branch selection (A, B, C)
- Product line filtering
- Customer type filtering
- Date range selection
- Real-time data updates

### Key Metrics
- Total sales
- Average customer rating
- Total number of customers
- Product line diversity
- Sales performance by branch
- Customer segmentation

## Technology Stack

### Backend
- Python 3.8+
- Flask
- Pandas
- Flask-CORS

### Frontend
- React
- Recharts for data visualization
- Tailwind CSS for styling
- Shadcn UI components
- Date-fns for date handling

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn package manager

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

2. Install required Python packages:
```bash
pip install flask flask-cors pandas
```

3. Place your CSV file in the backend directory:
- Ensure it's named 'supermarket_sales  Sheet1.csv'
- The CSV should contain the required columns as per the schema

4. Start the Flask server:
```bash
python app.py
```

The backend will start running on `http://localhost:5000`

### Frontend Setup

1. Create a new React project (if not already created):
```bash
npx create-react-app supermarket-dashboard
cd supermarket-dashboard
```

2. Install required dependencies:
```bash
npm install recharts date-fns
npm install -D tailwindcss postcss autoprefixer
```

3. Install Shadcn UI components:
```bash
npx shadcn-ui@latest init
```

4. Install required Shadcn UI components:
```bash
npx shadcn-ui@latest add card select button popover calendar
```

5. Copy the dashboard component files to your project

6. Start the development server:
```bash
npm start
```

The frontend will start running on `http://localhost:3000`

## API Endpoints

The backend provides the following API endpoints:

- `/api/summary` - Overall sales summary statistics
- `/api/sales-by-branch` - Branch-wise sales data
- `/api/sales-by-product-line` - Product line performance
- `/api/sales-by-payment` - Payment method distribution
- `/api/customer-demographics` - Customer demographic data
- `/api/sales-over-time` - Time series sales data
- `/api/ratings-analysis` - Customer ratings analysis
- `/api/time-analysis` - Time of day analysis
- `/api/product-performance` - Detailed product metrics
- `/api/branch-comparison` - Branch performance comparison
- `/api/customer-segments` - Customer segmentation analysis

Each endpoint accepts the following query parameters for filtering:
- `branch` - Filter by branch (A, B, or C)
- `product_line` - Filter by product line
- `customer_type` - Filter by customer type (Member or Normal)
- `date_from` - Start date for date range filter (YYYY-MM-DD)
- `date_to` - End date for date range filter (YYYY-MM-DD)

## Data Requirements

The application expects a CSV file with the following columns:
- Invoice ID
- Branch
- City
- Customer type
- Gender
- Product line
- Unit price
- Quantity
- Tax 5%
- Total
- Date
- Time
- Payment
- COGS
- Gross margin percentage
- Gross income
- Rating

## Usage

1. Start both backend and frontend servers
2. Access the dashboard at `http://localhost:3000`
3. Use the filter bar at the top to filter data:
   - Select specific branches
   - Choose product lines
   - Filter by customer type
   - Select date ranges
4. All charts and metrics will update automatically based on the selected filters

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
