import { assertEquals } from 'https://deno.land/std@0.142.0/testing/asserts.ts';
import { ExportData, Note, parseExportData, TagsPerNote } from './utils.ts';

Deno.test('parseExportData should properly parse data', () => {
  interface Test {
    input: ExportData;
    expected: {
      tags: string[];
      tagsPerNote: TagsPerNote;
      notes: Note[];
    };
  }

  const tests: Test[] = [
    {
      input: {
        version: '004',
        items: [],
      },

      expected: {
        tags: [],
        tagsPerNote: new Map(),
        notes: [],
      },
    },
    {
      input: {
        version: '004',
        items: [
          {
            content_type: 'Tag',
            content: {
              references: [
                {
                  uuid: 'note-fake-uuid-1',
                  content_type: 'Note',
                },
              ],
              title: 'test-tag',
            },
            created_at_timestamp: 1627494313117000,
            created_at: '2021-07-28T17:45:13.117Z',
            deleted: false,
            duplicate_of: null,
            updated_at_timestamp: 1653851707525640,
            updated_at: '2022-05-29T19:15:07.525Z',
            uuid: 'tag-fake-uuid-1',
          },
          {
            content_type: 'Note',
            content: {
              text: 'Some cool stuff right here\n',
              title: 'Test Note',
              references: [],
            },
            created_at_timestamp: 1627495471059000,
            created_at: '2021-07-28T18:04:31.059Z',
            deleted: false,
            duplicate_of: null,
            updated_at_timestamp: 1654331572463532,
            updated_at: '2022-06-04T08:32:52.463Z',
            uuid: 'note-fake-uuid-1',
          },
        ],
      },

      expected: {
        tags: ['test-tag'],
        tagsPerNote: new Map([['note-fake-uuid-1', ['tag-fake-uuid-1']]]),
        notes: [{
          uuid: 'note-fake-uuid-1',
          title: 'Test Note',
          content: 'Some cool stuff right here\n',
          created_at: new Date('2021-07-28T18:04:31.059Z'),
          updated_at: new Date('2022-06-04T08:32:52.463Z'),
        }],
      },
    },
  ];

  for (const test of tests) {
    const output = parseExportData(test.input);

    assertEquals(JSON.stringify(output), JSON.stringify(test.expected));
  }
});
