import styled from '@emotion/styled';
import { Theme } from '@mui/material/styles';

export type StyledComponent<P> = {
  (props: P & { theme?: Theme }): JSX.Element;
  displayName?: string;
};

export { styled };
