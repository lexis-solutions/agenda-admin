import { OptionsType, setOptions } from 'src/options';

import Agenda from 'agenda';
import { Express } from 'express';
import app from 'src/app';
import fs from 'fs-extra';
import path from 'path';
import replaceStream from 'replacestream';
import { setAgendaInstance } from 'src/agenda-instance';

export interface ParamsType {
  publicUrl: string;
  mountPath: string;
  expressApp: Express;
  agenda: Agenda;
  options?: OptionsType;
}

export const mountAgendaAdmin = async ({
  publicUrl,
  mountPath,
  expressApp,
  agenda,
  options,
}: ParamsType) => {
  await fs.copy(
    path.join(__dirname, '../client'),
    path.join(__dirname, '../public')
  );

  const indexHtml = path.join(__dirname, '../public/index.html');
  const updatedIndexHtml = fs
    .readFileSync(indexHtml, 'utf-8')
    .replace(/__PUBLIC_URL_PLACEHOLDER__/g, publicUrl);
  fs.writeFileSync(indexHtml, updatedIndexHtml);

  const directory = path.join(__dirname, '../public/static/js');
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.js'))
    .map((fileName) => path.join(directory, fileName));

  await Promise.all(
    files.map((file: string) =>
      (async () => {
        const tmpFile = `${file}.tmp`;
        await new Promise((resolve, reject) => {
          const stream = fs
            .createReadStream(file)
            .pipe(replaceStream('__PUBLIC_URL_PLACEHOLDER__', publicUrl))
            .pipe(fs.createWriteStream(tmpFile));
          stream.on('finish', resolve);
          stream.on('error', reject);
        });
        fs.unlinkSync(file);
        fs.copyFileSync(tmpFile, file);
        fs.unlinkSync(tmpFile);
      })()
    )
  );

  setAgendaInstance(agenda);
  setOptions(options);
  expressApp.use(mountPath, app);
};
