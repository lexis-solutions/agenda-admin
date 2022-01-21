import fs from 'fs';
import path from 'path';
import replaceStream from 'replacestream';
import Agenda from 'agenda';
import { URL } from 'url';
import { Express } from 'express';
import { setAgendaInstance } from 'src/agenda-instance';
import app from 'src/app';

interface ParamsType {
  publicUrl: string;
  expressApp: Express;
  agenda: Agenda;
}

export const mountAgendaAdmin = async ({
  publicUrl,
  expressApp,
  agenda,
}: ParamsType) => {
  const parsedUrl = new URL(publicUrl);

  const indexHtml = path.join(__dirname, '../../client/build/index.html');
  const updatedIndexHtml = fs
    .readFileSync(indexHtml, 'utf-8')
    .replace(/__PUBLIC_URL_PLACEHOLDER__/g, publicUrl);
  fs.writeFileSync(indexHtml, updatedIndexHtml);

  const directory = path.join(__dirname, '../../client/build/static/js');
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
  expressApp.use(parsedUrl.pathname, app);
};
