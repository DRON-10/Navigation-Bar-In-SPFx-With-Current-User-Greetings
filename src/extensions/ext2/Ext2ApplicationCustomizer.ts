import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'Ext2ApplicationCustomizerStrings';
import styles from './AppCustomizer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

const LOG_SOURCE: string = 'Ext2ApplicationCustomizer';


export interface IExt2ApplicationCustomizerProperties {
  
  Top: string;
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class Ext2ApplicationCustomizer
  extends BaseApplicationCustomizer<IExt2ApplicationCustomizerProperties> 
  {
  
    private _bottomPlaceholder: PlaceholderContent | undefined;
     @override
      public onInit(): Promise<void> 
      {
   

        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
  
        return Promise.resolve();
  
      }
      private _renderPlaceHolders(): void
       {
           const topPlaceholder =
         this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
           { onDispose: this.onDispose}
           );
  
      
         if (!topPlaceholder) 
         {
           console.error("The expected placeholder (Top) was not found.");
           return;
         }
  
              if (topPlaceholder.domElement){
              topPlaceholder.domElement.innerHTML = `
                  <div class = "${styles.topnav}">
                  <a class = "${styles.active}" href = "https://dronzer.sharepoint.com/sites/Barcelona/SitePages/Home.aspx">Home</a>
                  <a href = "https://dronzer.sharepoint.com/sites/Liverpool">News</a>
                  <a href = "https://dronzer.sharepoint.com/sites/chelsea">About us</a>
                  <a href = "https://dronzer.sharepoint.com/sites/mancity">Find Mentor</a>
                  </div> 
                  <span class = "${styles.top}">Hello! ${escape(this.context.pageContext.user.displayName)}</span> 
                   `;
                   
               }

    
    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );
  
      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }
  
      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(Bottom property was not defined.)";
        }
  
        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
          <div class="${styles.app}">
            <div class="${styles.bottom}">
              <i  aria-hidden="true"></i> ${escape(
                bottomString
              )}
            </div>
          </div>`;
        }
      }
    }
  }
  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}