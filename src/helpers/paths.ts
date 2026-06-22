import { resolve } from 'path';

import { getPackageInfo, getRelativePath } from '@ladamczyk/qoq-utils';

const PACKAGE_NAME = '@ladamczyk/skillslint';

const getCliPackagePath = (): string => {
  try {
    const { rootPath } = getPackageInfo(PACKAGE_NAME) ?? {};

    return rootPath;
  } catch {
    // this is for npx

    return process.cwd();
  }
};

const resolveCliPackagePath = (path: string): string => resolve(`${getCliPackagePath()}${path}`);

export const resolveCliRelativePath = (path: string): string =>
  getRelativePath(resolveCliPackagePath(path));
