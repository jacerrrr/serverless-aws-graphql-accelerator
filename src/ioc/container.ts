import 'reflect-metadata';

import { Container } from 'typedi';

import { AppLogger } from '@core';
import { environment } from '@environment';

import { DI_LOGGER } from './constants';

Container.set({ id: DI_LOGGER, factory: () => new AppLogger(environment) });

export const container = Container;
