import dayjs from 'dayjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { serve } = require('@upstash/workflow/express');

import Subscription from '../models/subscriptions.model';


const reminders = [9,6,2,1]
export const sendSubscriptionReminders = serve(async (context) => {
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId)

    if(!subscription || subscription.status != active )return;

    const renewalDate = dayjs(subscription.renewalDate)

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has passed for your subscription: ${subscriptionId}. Stopping workflow`);
        return;
    }

    for(const daysBefore of reminders){
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())){

        }
    }

}) 

const fetchSubscription = async(context, subscriptionId) =>{
    return await context.run("Get subscription", ()=>{
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
}

// this code below will put the reminder to sleep until it is close to the renewal date which is generated from the reminders = [9,6,2,1] code
const sleepUntilReminder = async(context, label, date) =>{
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(label, ()=>{
        console.log(`Triggering ${label} reminder`);

        
    })
}

