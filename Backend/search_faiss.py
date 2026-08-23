
# import sys
# import json
# import faiss
# import numpy as np

# vector_path = sys.argv[2]
# with open('College_Embeddings.json', encoding='utf-8') as f:
#     data = json.load(f)

# # vector_path = sys.argv[2]
# # with open(vector_path, encoding='utf-8') as f:
# #     data = json.load(f)

# #     print(f"📂 Loaded {len(data)} vectors from {vector_path}", file=sys.stderr)

# dim = len(data[0]['embedding'])
# index = faiss.IndexFlatL2(dim)
# vectors = np.array([d['embedding'] for d in data]).astype('float32')
# index.add(vectors)

# query_vector = np.array(json.loads(sys.argv[1])).astype('float32').reshape(1, -1)
# distances, indices = index.search(query_vector, 3)

# results = []
# for i in indices[0]:
#     if 0 <= i < len(data):
#         results.append({ "text": data[i]['text'] })

# print(json.dumps(results))


import sys
import json
import faiss
import numpy as np

query_vector = np.array(json.loads(sys.argv[1])).astype('float32').reshape(1, -1)
vector_path = sys.argv[2]  # ✅ Correctly use the dynamic path

with open(vector_path, encoding='utf-8') as f:
    data = json.load(f)

dim = len(data[0]['embedding'])
index = faiss.IndexFlatL2(dim)
vectors = np.array([d['embedding'] for d in data]).astype('float32')
index.add(vectors)

distances, indices = index.search(query_vector, 3)

results = []
for i in indices[0]:
    if 0 <= i < len(data):
        results.append({ "text": data[i]['text'] })

print(json.dumps(results))
