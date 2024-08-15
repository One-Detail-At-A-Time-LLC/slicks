// File: convex/message.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const send = mutation({
    args: {
        tenantId: v.id('tenants'),
        clientId: v.id('clients'),
        content: v.string(),
        sender: v.union(v.literal('tenant'), v.literal('client')),
    },
    handler: async (ctx, args) => {
        const message = {
            tenantId: args.tenantId,
            clientId: args.clientId,
            content: args.content,
            sender: args.sender,
            timestamp: Date.now(),
        };

        return await ctx.db.insert('messages', message);
    },
});

export const list = query({
    args: { tenantId: v.id('tenants'), clientId: v.id('clients') },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('messages')
            .filter(q =>
                q.and(
                    q.eq(q.field('tenantId'), args.tenantId),
                    q.eq(q.field('clientId'), args.clientId)
                )
            )
            .order('asc');
    },
});