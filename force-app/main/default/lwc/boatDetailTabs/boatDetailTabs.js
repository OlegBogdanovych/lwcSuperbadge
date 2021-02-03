/**
 * Created by olehbohdanovych on 02.02.2021.
 */

import { LightningElement, wire, api } from "lwc";
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import {
  subscribe,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

import { NavigationMixin } from 'lightning/navigation';

// Custom Labels Imports
// import labelDetails for Details
// import labelReviews for Reviews
// import labelAddReview for Add_Review
// import labelFullDetails for Full_Details
// import labelPleaseSelectABoat for Please_select_a_boat
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';

// Boat__c Schema Imports
// import BOAT_ID_FIELD for the Boat Id
// import BOAT_NAME_FIELD for the boat Name
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  // Private
  subscription = null;
  boatId;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };

  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
  }

  @wire(MessageContext)
  messageContext;

  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredRecord;

  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
    console.log('detailsTabIconName -->> ', this.wiredRecord.data ? 'utility:anchor' : null);
    return this.wiredRecord.data ? 'utility:anchor' : null;
  }

  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() {
    console.log('boat name -->> ', getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD));
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
  }

  // Subscribe to the message channel
  subscribeMC() {
    if (this.subscription) { return; }
    // local boatId must receive the recordId from the message
    this.subscription = subscribe(
      this.messageContext,
      BOATMC,
      (message) => {this.boatId = message.recordId;},
      { scope: APPLICATION_SCOPE }
    );
  }

  // Calls subscribeMC()
  connectedCallback() {
    this.subscribeMC();
  }

  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
    type: "standard__recordPage",
    attributes: {
      recordId: this.boatId,
      actionName: "view"
    }
  });}

  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() {
    this.template.querySelector('lightning-tabset').activeTabValue ='reviews';
    //this.template.querySelector('c-boat-reviews').refresh();
  }
}