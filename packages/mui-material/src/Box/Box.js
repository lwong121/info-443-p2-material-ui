import { createBox } from '@mui/system';
import PropTypes from 'prop-types';
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/utils';
import { createTheme } from '../styles';
import THEME_ID from '../styles/identifier';

const defaultTheme = createTheme();

const Box = createBox({
  themeId: THEME_ID,
  defaultTheme,
  defaultClassName: 'MuiBox-root',
  generateClassName: ClassNameGenerator.generate,
});

Box.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default Box;
