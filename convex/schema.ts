import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    words:defineTable({
        audioDefinitionStorageId: v.optional(v.id('_storage')),
        user:v.id('users'),
        definition:v.string(),
        word:v.string(),
        phonetic:v.optional(v.string()),
        isSeen:v.boolean(),
        audioWordUrl:v.optional(v.string()),
    })
    .searchIndex('search_word',{searchField:'word'})
    .searchIndex('search_definition',{searchField:'definition'})
    .searchIndex('search_user',{searchField:'user'}),
    
    users:defineTable({
        email:v.string(),
        imageUrl:v.string(),
        clerkId:v.string(),
        name:v.string(),

    })
})