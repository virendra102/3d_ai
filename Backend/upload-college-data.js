

import fs from 'fs';
import path from 'path';
import { pipeline } from '@xenova/transformers';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_DB_PATH = './College_Data/College_Data.json'; // or wherever you want to save

let embeddingExtractor = null;

const INPUT_PATH = './College_Data/College_Data.json';      // Original SSIT data (input)
const OUTPUT_PATH = './College_Embeddings.json';  // New file for embeddings (output)

// ✅ Generate Embeddings using Xenova
async function generateEmbedding(text) {
    try {
        if (!embeddingExtractor) {
            console.log("🔄 Initializing embedding model...");
            embeddingExtractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("✅ Embedding model initialized successfully");
        }
        const result = await embeddingExtractor(text, { pooling: 'mean', normalize: true });
        return Array.from(result.data);
    } catch (error) {
        console.error("❌ Error generating embedding:", error);
        throw error;
    }
}

// ✅ Save Data Locally
function saveDataLocally(entry) {
    const existing = fs.existsSync(OUTPUT_PATH)
    ? JSON.parse(fs.readFileSync(OUTPUT_PATH))
    : [];


    const alreadyExists = existing.some(item => item.text === entry.text);
    if (alreadyExists) {
        console.log(`⚠️ Skipped duplicate: ${entry.text.slice(0, 30)}...`);
        return false;
    }

    existing.push(entry);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2));
    return true;
}

// ✅ Main Function
async function main() {
    try {
        const filePath = path.resolve('./College_Data/College_Data.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);
        const sections = jsonData.sections;

        if (!Array.isArray(sections)) {
            throw new Error("Expected 'sections' to be an array.");
        }

        console.log(`📋 Found ${sections.length} sections in JSON file.`);

        let successCount = 0;

        for (const section of sections) {
            // Compose the full text from various fields in each section
            let content = `Section: ${section.title}\n`;

            if (section.questions) {
                section.questions.forEach(q => {
                    content += `Q: ${q.q}\nA: ${Array.isArray(q.a) ? q.a.join("; ") : q.a}\n`;
                });
            }

            if (section.points) {
                content += `Points:\n- ${section.points.join("\n- ")}\n`;
            }

            if (section.comparison) {
                content += `Comparison:\n${JSON.stringify(section.comparison, null, 2)}\n`;
            }

            if (section.activities) {
                content += `Activities:\n- ${section.activities.join("\n- ")}\n`;
            }

            if (section.note) {
                content += `Note: ${section.note}\n`;
            }

            const embedding = await generateEmbedding(content);

            const record = {
                id: uuidv4(),
                embedding,
                text: content,
                title: section.title,
                category: "SSIT FAQ",
                tags: [],
                source: "College_Data.json",
                originalId: section.title
            };

            const saved = saveDataLocally(record);
            if (saved) {
                console.log(`✅ Saved: ${record.originalId}`);
                successCount++;
            }
        }

        console.log(`🎉 Upload complete. ${successCount} sections saved to  ${OUTPUT_PATH}`);
    } catch (error) {
        console.error("❌ Error during local upload:", error);
    }
}

main().catch(console.error);
