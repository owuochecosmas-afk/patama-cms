import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";

function App() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    // Real-time listen
    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, []);

    const addItem = async () => {
        if (!name || !price) return alert("Add name and price");
        await addDoc(collection(db, "products"), {
            name,
            price: Number(price),
            createdAt: Date.now()
        });
        setName(""); setPrice("");
    };

    const removeItem = async (id) => {
        await deleteDoc(doc(db, "products", id));
    };

    return (
        <div style={{ padding: 20, fontFamily: "Arial" }}>
            <h1>PATAMA CMS - Real-time 🔥</h1>
            <input placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <button onClick={addItem}>Add</button>
            <hr />
            {items.map(item => (
                <div key={item.id} style={{ border: "1px solid #ccc", margin: 5, padding: 10 }}>
                    {item.name} - Ksh {item.price}
                    <button onClick={() => removeItem(item.id)} style={{ marginLeft: 10 }}>Delete</button>
                </div>
            ))}
        </div>
    );
}
export default App;