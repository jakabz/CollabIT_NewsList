import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'NewsListWebPartStrings';
import NewsList from './components/NewsList';
import { INewsListProps } from './components/INewsListProps';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

export interface INewsListWebPartProps {
  title: string;
  newsList: any;
  global: boolean;
}

export default class NewsListWebPart extends BaseClientSideWebPart<INewsListWebPartProps> {

  private listResult;
  private listInit = false;

  public render(): void {
    
    if(!this.listInit){
      let query = '';
      query += '$select=ID,Title,BannerImageUrl,Description,FileRef&';
      query += '$filter=(PromotedState eq 2) and (FinalApproved eq 1) and (FSObjType eq 0)&';
      query += '$orderby=FirstPublishedDate desc';
      this._getListData(query,this.properties.global).then((response) => {
        this.listResult = response.value;
        this.listInit = true;
        this.render();
      });
    }
    
    const element: React.ReactElement<INewsListProps > = React.createElement(
      NewsList,
      {
        title: this.properties.title,
        global: this.properties.global,
        newsList: this.listResult
      }
    );
    if(this.listInit){
      ReactDom.render(element, this.domElement);
    }
  }

  private _getListData(query:string, central:boolean): Promise<any> {
    let host = central ? "https://qualysoftholding.sharepoint.com/sites/intranet" : this.context.pageContext.web.absoluteUrl;
    return this.context.spHttpClient.get(host + `/_api/web/Lists/GetByTitle('Site Pages')/Items?` + query, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
