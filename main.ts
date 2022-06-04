import { parse } from 'https://deno.land/std@0.142.0/flags/mod.ts';
import { createNotes, createTagsFolders, ExportData, parseExportData } from './utils.ts';

const exportFileName = 'Standard Notes Backup and Import File.txt';

async function main(args: string[]) {
  const { ['file-extension']: fileExtension = 'txt', ['output-directory']: outputDirectory = 'exports' } = parse(args);

  const exportDataContent = await Deno.readTextFile(exportFileName);

  try {
    const exportData: ExportData = JSON.parse(exportDataContent);

    const { tags, tagsPerNote, notes } = parseExportData(exportData);

    if (tags.length === 0) {
      console.log(
        'There are no tags! You can just get everything from the the Notes folder of the exoprt',
      );
      Deno.exit(1);
    }

    await createTagsFolders(outputDirectory, tags);

    await createNotes(notes, tagsPerNote, outputDirectory, fileExtension);
  } catch (error) {
    console.log(error);
    Deno.exit(1);
  }

  Deno.exit(0);
}

await main(Deno.args);
