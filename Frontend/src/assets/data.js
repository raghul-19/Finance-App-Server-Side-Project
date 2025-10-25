import {List,LayoutDashboard,Wallet,SendToBack,FunnelPlus} from 'lucide-react'
import { assets } from './assets';

export const pages=[
    {
        name:"Dashboard",
        image:LayoutDashboard,
        link:"/"
    },
    {
        name:"Category",
        image:List,
        link:"/category"
    },
    {
        name:"Income",
        image:Wallet,
        link:"/income"
    },
    {
        name:"Expense",
        image:SendToBack,
        link:"/expense"
    },
    {
        name:"Filter",
        image:FunnelPlus,
        link:"/filter"
    },

]

export const testingIncome=[
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
    {
        name:"mid year bonus",
        date:"12th July 2025",
        img:assets.groceries,
    },
]

export const categoryTypes=["Income","Expense"];

export function formatDate(dateString) {
    const date = new Date(dateString); // Input like "2025-08-25"
    
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
  
    // Add ordinal suffix
    const dayWithSuffix = getDayWithSuffix(day);
  
    return `${dayWithSuffix} ${month}, ${year}`;
  }
  
  function getDayWithSuffix(day) {
    if (day >= 11 && day <= 13) return day + 'th';
    switch (day % 10) {
      case 1: return day + 'st';
      case 2: return day + 'nd';
      case 3: return day + 'rd';
      default: return day + 'th';
    }
  }