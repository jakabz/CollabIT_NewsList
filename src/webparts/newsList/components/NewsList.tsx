import * as React from 'react';
import styles from './NewsList.module.scss';
import { INewsListProps } from './INewsListProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { FontWeights } from '@uifabric/styling';
import Pagination from 'office-ui-fabric-react-pagination';
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from '@uifabric/react-cards';
import {
  IIconStyles,
  Stack,
  IStackTokens,
  Text,
  ITextStyles
} from 'office-ui-fabric-react';

import { INewsListState } from './INewsListState'; 

export default class NewsList extends React.Component<INewsListProps, INewsListState> {
  
  public self = this;
  
  public constructor(props: INewsListProps, state: INewsListState) {
    super(props);
    this.state = { isOpen: false, searchStr:'', actPage: 1, pageSize: 10 };
  }

  public openPane():void {
    this.setState({ isOpen: true }); 
  }

  public dismissPanel():void {
    this.setState({ isOpen: false });
  }
  
  private items:any;
  private filteredItems: any;
  
  public render(): React.ReactElement<INewsListProps> {

    this.filteredItems = this.props.newsList.filter((item) => {
      return item.Title.toLowerCase().search(this.state.searchStr.toLowerCase()) !== -1 || (item.Description && item.Description.toLowerCase().search(this.state.searchStr.toLowerCase()) !== -1);
    });

    this.items = this.filteredItems.map((item, key) => {
      if(key < this.state.actPage * this.state.pageSize && key >= (this.state.actPage-1) * this.state.pageSize)
      return <Card horizontal onClick={() => window.open(item.FileRef)} tokens={cardTokens} className={ styles.newsFeedItem }>
        <Card.Item fill>
          <div className={ styles.newsFeedImage } style={{backgroundImage: `url(${item.BannerImageUrl.Url})`}}></div>
        </Card.Item>
        <Card.Section>
          <Text variant="small" styles={siteTextStyles} className={styles.title}>{item.Title}</Text>
          <Text variant="small" styles={siteTextStyles} className={styles.date}>{new Date(item.FirstPublishedDate).toLocaleString('hu-HU')}</Text>
          <Text styles={descriptionTextStyles} className={styles.desc}>{item.Description}</Text>
        </Card.Section>
      </Card>
    });

    function _onChangeOrder(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
      console.dir(option);
    }

    function _onChangeSource(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
      console.dir(option);
    }

    const siteTextStyles: ITextStyles = {
      root: {
        color: '#025F52',
        fontWeight: FontWeights.semibold
      }
    };
    const descriptionTextStyles: ITextStyles = {
      root: {
        color: '#333333',
        fontWeight: FontWeights.regular
      }
    };
    const helpfulTextStyles: ITextStyles = {
      root: {
        color: '#333333',
        fontWeight: FontWeights.regular
      }
    };
    const iconStyles: IIconStyles = {
      root: {
        color: '#0078D4',
        fontSize: 16,
        fontWeight: FontWeights.regular
      }
    };
    const footerCardSectionStyles: ICardSectionStyles = {
      root: {
        borderLeft: '1px solid #F3F2F1'
      }
    };
    
    const sectionStackTokens: IStackTokens = { childrenGap: 20 };
    const cardTokens: ICardTokens = { childrenMargin: 12 };
    const footerCardSectionTokens: ICardSectionTokens = { padding: '0px 0px 0px 12px' };
    //console.info(this.props.newsList);
    return (
      <div className={ styles.newsList }>
        <div className={styles.wptitle}>
          <Icon iconName="NewsSearch" className={styles.wptitleIcon} />
          <span>{this.props.title}</span>
        </div>
        <div className={styles.toolbar}>
          <SearchBox
            className={styles.searcBox}
            placeholder="Search..."
            //onSearch={newValue => this.setState({ searchStr: newValue, actPage:1  })}
            onChange={(value) => this.setState({ searchStr: value, actPage:1 })}
          />
        </div>
        <div>
          <Stack tokens={sectionStackTokens} className={styles.newsFeedItems}>
            {this.items}
          </Stack>
        </div>
        {this.filteredItems.length > this.state.pageSize ?
        <div className={ styles.pagination }>
          <Pagination
            currentPage={this.state.actPage}
            totalPages={this.filteredItems.length % this.state.pageSize != 0 ? Math.round(this.filteredItems.length / this.state.pageSize)+1: this.filteredItems.length / this.state.pageSize}
            hidePreviousAndNextPageLinks={true}
            hideFirstAndLastPageLinks={true}
            onChange={(page) => this.setState({ actPage: page })}
          />
        </div>
        : ''}

        <Panel
          headerText="News filter"
          isOpen={this.state.isOpen}
          onDismiss={() => this.dismissPanel()}
          closeButtonAriaLabel="Close"
          className={styles.panel}
        >
          <ChoiceGroup
            id="source"
            label="Source"
            defaultSelectedKey="local"
            onChange={_onChangeSource}
            options={[
              {
                key: 'local',
                iconProps: { iconName: 'Megaphone' },
                text: 'Local'
              },
              {
                key: 'glabal',
                iconProps: { iconName: 'Globe' },
                text: 'Global'
              }
            ]}
          />
          <ChoiceGroup
            id="order"
            label="Order by"
            defaultSelectedKey="date"
            onChange={_onChangeOrder}
            options={[
              {
                key: 'title',
                iconProps: { iconName: 'TextField' },
                text: 'Title'
              },
              {
                key: 'date',
                iconProps: { iconName: 'EventDate' },
                text: 'Publish date'
              }
            ]}
          />
        </Panel>

      </div>
    );
  }
}
