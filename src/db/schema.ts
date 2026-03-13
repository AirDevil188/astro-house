import { relations, InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  primaryKey,
  uuid,
} from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('roles', [
  'user',
  'editor',
  'moderator',
  'admin',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar').default(
    'https://res.cloudinary.com/drsaqjwi7/image/upload/v1773246767/avatar_default_bw3adb.png'
  ),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: userRoles().default('user').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  postId: uuid('post_id')
    .references(() => posts.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const postToTags = pgTable(
  'post_to_tags',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    tagId: uuid('tags_id')
      .references(() => tags.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    // The new syntax uses an array of constraints
    primaryKey({ columns: [table.postId, table.tagId] }),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  post: many(posts),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.userId], references: [users.id] }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  tags: many(postToTags),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(posts),
}));

export const postsToTagsRelations = relations(postToTags, ({ one }) => ({
  post: one(posts, {
    fields: [postToTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postToTags.tagId],
    references: [tags.id],
  }),
}));

// typescript types
export type User = InferSelectModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
export type Comments = InferSelectModel<typeof comments>;
export type Categories = InferSelectModel<typeof categories>;
export type Tags = InferSelectModel<typeof tags>;
export type PostToTags = InferSelectModel<typeof postToTags>;
