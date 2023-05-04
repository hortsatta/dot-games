'use client';

import { Button } from '@material-tailwind/react';
import type { ComponentProps } from 'react';

const BaseButton = (props: ComponentProps<typeof Button>) => (
  <Button {...props} />
);

export default BaseButton;
