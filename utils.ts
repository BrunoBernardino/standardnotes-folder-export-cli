type ExportDataContentType = 'Note' | 'Tag';

interface ExportDataReference {
  uuid: string;
  content_type: ExportDataContentType;
}

export interface ExportDataItem {
  content_type: ExportDataContentType;
  content: {
    references: ExportDataReference[];
    title?: string;
    text?: string;
    trashed?: boolean;
  };
  created_at_timestamp: number;
  created_at: string;
  deleted: boolean;
  duplicate_of: string | null;
  updated_at_timestamp: number;
  updated_at: string;
  uuid: string;
}

export interface ExportData {
  version: string;
  items: ExportDataItem[];
}

export type TagsPerNote = Map<string, string[]>;

export interface Note {
  uuid: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export function parseExportData(exportData: ExportData) {
  const tagsPerNote: TagsPerNote = new Map();
  const tags = new Set<string>();
  const notes: Note[] = [];

  for (const item of exportData.items) {
    if (item.content_type !== 'Tag' && item.content_type !== 'Note') {
      continue;
    }

    if (item.content_type === 'Tag' && !item.content.title) {
      console.log('Found a tag item without a title! Skipping.');
      console.log(JSON.stringify({ item }, null, 2));
      continue;
    }

    if (item.content_type === 'Tag' && item.content.references.length === 0) {
      console.log('Found a tag item without any notes! Skipping.');
      console.log(JSON.stringify({ item }, null, 2));
      continue;
    }

    if (item.content_type === 'Tag' && (item.deleted || item.content.trashed)) {
      console.log(`Found a deleted tag item with notes! Skipping.`);
      console.log(JSON.stringify({ item }, null, 2));
      continue;
    }

    if (item.content_type === 'Note' && !item.content.title) {
      console.log('Found a note item without any title! Skipping.');
      console.log(JSON.stringify({ item }, null, 2));
      continue;
    }

    if (item.content_type === 'Note' && (item.deleted || item.content.trashed)) {
      continue;
    }

    if (item.content_type === 'Note' && !item.content.text) {
      console.log('Found a note item without any content! Skipping.');
      console.log(JSON.stringify({ item }, null, 2));
      continue;
    }

    if (item.content_type === 'Tag') {
      tags.add(item.content.title!);

      for (const reference of item.content.references) {
        if (reference.content_type !== 'Note') {
          continue;
        }

        tagsPerNote.set(reference.uuid, [
          ...(tagsPerNote.get(reference.uuid) || []),
          item.content.title!,
        ]);
      }
    } else if (item.content_type === 'Note') {
      const note: Note = {
        uuid: item.uuid,
        title: item.content.title!,
        content: item.content.text!,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
      };

      notes.push(note);
    }
  }

  return {
    tags: Array.from(tags),
    tagsPerNote,
    notes,
  };
}

function parseNameForFilesystem(name: string) {
  return name.replaceAll('/', '-').replaceAll('\\', '-');
}

const defaultTag = 'Untagged';

export async function createTagsFolders(
  outputDirectory: string,
  tags: string[],
) {
  await Promise.all(tags.map(async (tag) => {
    await Deno.mkdir(`${outputDirectory}/${parseNameForFilesystem(tag)}`, { recursive: true });
  }));

  await Deno.mkdir(`${outputDirectory}/${defaultTag}`, { recursive: true });
}

export async function createNotes(
  notes: Note[],
  tagsPerNote: TagsPerNote,
  outputDirectory: string,
  fileExtension: string,
) {
  await Promise.all(notes.map(async (note) => {
    for (const tag of [...(tagsPerNote.get(note.uuid) || [defaultTag])]) {
      await Deno.writeTextFile(
        `${outputDirectory}/${parseNameForFilesystem(tag)}/${parseNameForFilesystem(note.title)}.${fileExtension}`,
        note.content,
      );
    }
  }));
}
