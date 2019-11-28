import * as React from 'react';
import styles from './NewsList.module.scss';
import { INewsListProps } from './INewsListProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { INewsListState } from './INewsListState'; 

export default class NewsList extends React.Component<INewsListProps, INewsListState> {

  public self = this;
  
  public constructor(props: INewsListProps, state: INewsListState) {
    super(props);
    this.state = { isOpen: false };
  }

  public openPane():void {
    this.setState({ isOpen: true }); 
  }

  public dismissPanel():void {
    this.setState({ isOpen: false });
  }
  
  private items:any;
  
  public render(): React.ReactElement<INewsListProps> {

    this.items = this.props.newsList.map((item, key) =>
      <a href={item.FileRef} title={item.Title} target="_blank" className={styles.newsFeedItem}>
        <h3 className={styles.newsFeedTitle}>
          <span>{item.Title}</span>
        </h3>
        <div className={styles.newsFeedImage}>
          <img src={item.BannerImageUrl.Url} alt={item.Title}/>
        </div>
        <div className={styles.newsFeedBody}>
          <div className={styles.newsFeedContent}>{item.Description}</div>
        </div>
        <div className={styles.clear}></div>
      </a>
    );

    function _onChangeOrder(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
      console.dir(option);
    }

    function _onChangeSource(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
      console.dir(option);
    }
    
    return (
      <div className={ styles.newsList }>
        <div className={styles.wptitle}>
          <Icon iconName="NewsSearch" className={styles.wptitleIcon} />
          <span>{this.props.title}</span>
        </div>
        <div className={styles.toolbar}>
          <SearchBox
            className={styles.searcBox}
            placeholder="Search"
            onSearch={newValue => console.log('value is ' + newValue)}
            onFocus={() => console.log('onFocus called')}
            onBlur={() => console.log('onBlur called')}
            onChange={() => console.log('onChange called')}
          />
          <DefaultButton className={styles.settingsButton} text="Filter" onClick={() => this.openPane()} />
        </div>
        <div className={styles.newsFeedItems}>
          {this.items}
        </div>

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
