import 'reflect-metadata';

import { Container } from 'typedi';

import { AppLogger } from '@core';
import { environment } from '@environment';

import { DI_LOGGER } from './constants';

Container.set(DI_LOGGER, new AppLogger(environment));

export const container = Container;
