/**
 * Created by olehbohdanovych on 01.02.2021.
 */

import { LightningElement } from "lwc";

import { NavigationMixin } from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {
  isLoading = false;

  // Handles loading event
  handleLoading() {
    this.isLoading = true;
  }

  // Handles done loading event
  handleDoneLoading() {
    this.isLoading = false;
  }

  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    const selectedBoatTypeId = event.detail.boatTypeId;
    this.template.querySelector('c-boat-search-results').searchBoats(selectedBoatTypeId);

    this.template.querySelector('c-boat-search-results').refresh();
  }

  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Boat__c',
        actionName: 'new'
      }
    });
  }
}