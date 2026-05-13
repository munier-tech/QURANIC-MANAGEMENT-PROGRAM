# Financial Tracking System - quranic management system

## Overview

The Financial Tracking System automatically calculates and tracks the school's financial status by aggregating student fees as income and teacher salaries as expenses. This system provides comprehensive monthly and yearly financial summaries with detailed breakdowns.

## Key Features

### 1. Automatic Financial Calculation
- **Student Fees as Income**: Automatically aggregates all paid student fees for each month
- **Teacher Salaries as Expenses**: Automatically aggregates all paid teacher salaries for each month
- **Unpaid Fees as Debt**: Tracks unpaid student fees as outstanding debt
- **Net Profit Calculation**: Calculates profit/loss (Income - Expenses)

### 2. Monthly Financial Summaries
- Auto-generate monthly finance records
- View detailed breakdowns by month
- Track paid vs unpaid fees and salaries
- Calculate average per student/teacher

### 3. Yearly Financial Overview
- Complete yearly breakdown by month
- Total income, expenses, and debt for the year
- Monthly comparison charts
- Annual financial trends

### 4. Enhanced Finance Management
- Manual finance entry for additional income/expenses
- Automatic vs manual finance record distinction
- Comprehensive financial reporting

## System Components

### Backend Enhancements

#### 1. Enhanced Finance Controller (`backend/controllers/financeController.js`)
- `generateMonthlyFinance()`: Auto-generates monthly finance summaries
- `getFinanceSummary()`: Gets detailed monthly breakdown
- `getYearlyFinanceBreakdown()`: Gets complete yearly overview
- Enhanced aggregation queries for fees and salaries

#### 2. Updated Finance Model (`backend/models/financeModel.js`)
- Added fields for auto-generated records
- Monthly and yearly tracking
- Payment counts and statistics
- Auto-generation flag

#### 3. New API Endpoints (`backend/routes/financeRoute.js`)
- `POST /finance/generate-monthly`: Generate monthly finance
- `GET /finance/summary`: Get monthly summary
- `GET /finance/yearly-breakdown`: Get yearly breakdown

### Frontend Components

#### 1. Enhanced Finance Store (`frontend/src/store/financeStore.js`)
- Auto-generation functions
- Summary and breakdown retrieval
- Enhanced state management
- Filtering for auto-generated vs manual records

#### 2. Main Finance Dashboard (`frontend/src/components/finance/Finance.jsx`)
- Auto-generation interface
- Monthly/yearly selection
- Real-time financial statistics
- Enhanced visualization

#### 3. Generate Monthly Finance (`frontend/src/components/finance/GenerateMonthlyFinance.jsx`)
- Dedicated monthly finance generation
- Preview functionality
- Detailed breakdown display
- Step-by-step instructions

#### 4. Finance Summary (`frontend/src/components/finance/FinanceSummary.jsx`)
- Comprehensive financial overview
- Monthly and yearly breakdowns
- Detailed statistics
- Educational explanations

## How It Works

### 1. Student Fees → Income
```javascript
// Automatically calculates total paid student fees for the month
const studentFeesResult = await Fee.aggregate([
  { 
    $match: { 
      month: monthNum, 
      year: yearNum, 
      paid: true 
    } 
  },
  { 
    $group: { 
      _id: null, 
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    } 
  }
]);
```

### 2. Teacher Salaries → Expenses
```javascript
// Automatically calculates total paid teacher salaries for the month
const teacherSalariesResult = await Salary.aggregate([
  { 
    $match: { 
      month: monthNum, 
      year: yearNum, 
      paid: true 
    } 
  },
  { 
    $group: { 
      _id: null, 
      total: { $sum: "$totalAmount" },
      count: { $sum: 1 }
    } 
  }
]);
```

### 3. Unpaid Fees → Debt
```javascript
// Tracks unpaid student fees as debt
const unpaidFeesResult = await Fee.aggregate([
  { 
    $match: { 
      month: monthNum, 
      year: yearNum, 
      paid: false 
    } 
  },
  { 
    $group: { 
      _id: null, 
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    } 
  }
]);
```

## Usage Guide

### 1. Generate Monthly Finance
1. Navigate to **Finance → Abuur Maalgelin Bishan**
2. Select the month and year
3. Click **"Eeg Faahfaahinta"** to preview
4. Click **"Abuur Maalgelin"** to save

### 2. View Financial Summary
1. Navigate to **Finance → Faahfaahinta Maalgelinta**
2. Select month/year and click **"Eeg Bishan"**
3. View detailed breakdown including:
   - Income (Student Fees)
   - Expenses (Teacher Salaries)
   - Debt (Unpaid Fees)
   - Net Profit

### 3. View Yearly Breakdown
1. In Finance Summary, select year
2. Click **"Eeg Sanadka"**
3. View complete monthly breakdown table
4. See yearly totals and trends

### 4. Main Finance Dashboard
1. Navigate to **Finance → Maamulka Maalgelinta**
2. Use the auto-generation section
3. View recent finances
4. Access all financial features

## Financial Calculations

### Income (Dakhliga)
- **Source**: Paid student fees
- **Calculation**: Sum of all `paid: true` fee records for the month
- **Display**: Green cards with student count

### Expenses (Kharashka)
- **Source**: Paid teacher salaries
- **Calculation**: Sum of all `paid: true` salary records for the month
- **Display**: Red cards with teacher count

### Debt (Qaansheega)
- **Source**: Unpaid student fees
- **Calculation**: Sum of all `paid: false` fee records for the month
- **Display**: Orange cards with unpaid count

### Net Profit (Faahfaahin)
- **Calculation**: Income - Expenses
- **Display**: Green (profit) or Red (loss)

## Database Schema Updates

### Finance Model Enhancements
```javascript
{
  // Existing fields
  date: Date,
  income: Number,
  expenses: Number,
  debt: Number,
  
  // New fields for auto-generated records
  month: Number,
  year: Number,
  isAutoGenerated: Boolean,
  paidFeesCount: Number,
  paidSalariesCount: Number,
  unpaidFeesCount: Number,
  lastUpdated: Date
}
```

## Benefits

### 1. Automated Financial Tracking
- No manual calculation required
- Real-time financial status
- Accurate monthly summaries
- Historical data tracking

### 2. Comprehensive Reporting
- Monthly breakdowns
- Yearly overviews
- Payment statistics
- Trend analysis

### 3. User-Friendly Interface
- Somali language support
- Intuitive navigation
- Visual indicators
- Step-by-step guidance

### 4. Data Integrity
- Automatic aggregation
- Consistent calculations
- Audit trail
- Error handling

## Technical Implementation

### Backend Architecture
- **MongoDB Aggregation**: Efficient data processing
- **RESTful APIs**: Clean endpoint structure
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation and sanitization

### Frontend Architecture
- **React Hooks**: State management
- **Zustand Store**: Centralized state
- **Tailwind CSS**: Responsive design
- **React Icons**: Visual consistency

### Data Flow
1. **Fee/Salary Records** → Database
2. **Aggregation Queries** → Calculate totals
3. **Finance Records** → Store results
4. **Frontend Components** → Display data
5. **User Interface** → Interactive features

## Future Enhancements

### 1. Advanced Analytics
- Financial trend analysis
- Predictive modeling
- Performance metrics
- Comparative reports

### 2. Export Features
- PDF financial reports
- Excel data export
- Email notifications
- Automated reporting

### 3. Additional Integrations
- Bank account integration
- Payment gateway integration
- Accounting software sync
- Tax calculation features

## Support and Maintenance

### Regular Tasks
- Monitor data accuracy
- Review aggregation queries
- Update financial calculations
- Backup financial data

### Troubleshooting
- Check fee/salary record status
- Verify aggregation queries
- Review error logs
- Test calculation accuracy

---

**Note**: This system automatically calculates financial summaries based on existing fee and salary records. Ensure all student fees and teacher salaries are properly recorded for accurate financial tracking.
