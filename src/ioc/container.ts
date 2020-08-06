import 'reflect-metadata';

import { Container } from 'typedi';

import { environment } from '@environment';
import { AppLogger } from '@util';

import { DI_LOGGER } from './constants';

Container.set(DI_LOGGER, new AppLogger(environment));

export const container = Container;
