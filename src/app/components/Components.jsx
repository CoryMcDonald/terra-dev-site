import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import 'terra-base/lib/baseStyles';

import { siteConfigPropType } from './ComponentsProptypes';
import ComponentsUtils from './ComponentsUtils';
import Placeholder from '../common/Placeholder';
import styles from './Components.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Generated by configureApp.jsx: The array of components that should be displays.
   */
  config: siteConfigPropType,
  /**
   * Injected by react-routed: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  /**
   * The path root to prepend to the component routes.
   */
  pathRoot: PropTypes.string,
  /**
   * The component example type to generate components for.
   */
  exampleType: PropTypes.string,
  /**
   * The image source to display as the placeholder.
   */
  placeholderSrc: PropTypes.string,
};

const generateComponentRoutes = (config, exampleType, pathRoot, placeholderSrc) => {
  const placeholder = () => (
    <Placeholder src={placeholderSrc} />
  );

  const routes = ComponentsUtils.generateRoutes([], config, exampleType, pathRoot).map(
    component => (
      <Route
        key={component.fullPath}
        path={`${component.fullPath}`}
        component={component.needsPlaceholder ? placeholder : component.component}
      />
  ));

  routes.push((
    <Route
      key={pathRoot}
      path={`${pathRoot}`}
      component={placeholder}
    />
  ));

  return routes;
};

class Components extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.element && prevProps.location.pathname !== this.props.location.pathname) {
      this.element.scrollTop = 0;
    }
  }

  render() {
    const { config, exampleType, pathRoot, placeholderSrc } = this.props;

    const componentsClassNames = cx([
      'site-content',
      { 'raw-content': pathRoot === '/raw/tests' },
    ]);

    return (
      <div
        data-terra-dev-site-content
        className={componentsClassNames}
        ref={(element) => { this.element = element; }}
      >
        <Switch>
          {generateComponentRoutes(config, exampleType, pathRoot, placeholderSrc)}
        </Switch>
      </div>
    );
  }
}

Components.propTypes = propTypes;

export default withRouter(Components);
