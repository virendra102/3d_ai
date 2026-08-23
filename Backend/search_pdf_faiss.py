#!/usr/bin/env python
import sys
import json
import faiss
import numpy as np

def main():
    # Check if we have the right args
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Expected 2 arguments: embedding and vector_path"}))
        sys.exit(1)
    
    # Parse args
    embedding_str = sys.argv[1]
    vector_path = sys.argv[2]
    
    try:
        # Load embedding and convert to numpy
        embedding = json.loads(embedding_str)
        embedding_np = np.array([embedding], dtype=np.float32)
        
        # Load vector data
        with open(vector_path, 'r') as f:
            data = json.load(f)
        
        if not data:
            print(json.dumps([]))
            sys.exit(0)
        
        # Extract vectors and create index
        texts = [item['text'] for item in data]
        vectors = [item['embedding'] for item in data]
        vectors_np = np.array(vectors, dtype=np.float32)
        
        dimension = len(vectors[0])
        index = faiss.IndexFlatL2(dimension)
        index.add(vectors_np)
        
        # Search
        top_k = min(3, len(vectors))
        distances, indices = index.search(embedding_np, top_k)
        
        # Prepare results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(texts):
                results.append({
                    "text": texts[idx],
                    "score": float(1.0 / (1.0 + distances[0][i]))
                })
        
        # Return results
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main() 