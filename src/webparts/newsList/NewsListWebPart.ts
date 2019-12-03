import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'NewsListWebPartStrings';
import NewsList from './components/NewsList';
import { INewsListProps } from './components/INewsListProps';
import { sp, Web } from "@pnp/sp";

export interface INewsListWebPartProps {
  title: string;
  newsList: any;
  global: boolean;
  order: string;
}

export default class NewsListWebPart extends BaseClientSideWebPart<INewsListWebPartProps> {

  public render(): void {
    if(this.properties.global){
      const filter = "(PromotedState eq 2) and (FinalApproved eq 1) and (FSObjType eq 0)";
      const orderField = "FirstPublishedDate";
      const orderType = false;
      let web = new Web('https://qualysoftholding.sharepoint.com/sites/intranet');
      web.lists.getByTitle("Site Pages").items.filter(filter).orderBy(orderField,orderType).get().then(p => {
        const element: React.ReactElement<INewsListProps > = React.createElement(
          NewsList,
          {
            title: this.properties.title,
            global: this.properties.global,
            newsList: p
          }
        );
        ReactDom.render(element, this.domElement);
      });
    } else {
      const filter = "(PromotedState eq 2) and (FinalApproved eq 1) and (FSObjType eq 0)";
      const orderField = "FirstPublishedDate";
      const orderType = false;
      sp.web.lists.getByTitle("Site Pages").items.filter(filter).orderBy(orderField,orderType).get().then(p => {
        const element: React.ReactElement<INewsListProps > = React.createElement(
          NewsList,
          {
            title: this.properties.title,
            global: this.properties.global,
            newsList: p
          }
        );
        ReactDom.render(element, this.domElement);
      });
    }
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
                }),
                PropertyPaneToggle('global', {
                  label: strings.GlobalFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
