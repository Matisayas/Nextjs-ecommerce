
import setupAnalyticsService from '../lib/my-analytics-service'
 
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)
export default HomePage

// This will NOT be inlined, because it uses a variable
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])
 
// This will NOT be inlined, because it uses a variable
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)