import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";

const initialItems = [

    { id: "1", text: "60-Domed Mosque", type: "monuments" },
    { id: "2", text: "84 Pillar Cenotaph", type: "monuments" },
    { id: "3", text: "Orchha Palace Hotel", type: "hotels" },
    { id: "4", text: "60-Domed Mosque", type: "monuments" },
    { id: "5", text: "84 Pillar Cenotaph", type: "monuments" },
    { id: "6", text: "Orchha Palace Hotel", type: "hotels" },
    { id: "7", text: "60-Domed Mosque", type: "monuments" },
    { id: "8", text: "84 Pillar Cenotaph", type: "monuments" },
    { id: "9", text: "Orchha Palace Hotel", type: "hotels" },
    { id: "10", text: "60-Domed Mosque", type: "monuments" },
    { id: "12", text: "84 Pillar Cenotaph", type: "monuments" },
    { id: "13", text: "Orchha Palace Hotel", type: "hotels" },
    { id: "11", text: "60-Domed Mosque", type: "monuments" },
    { id: "14", text: "84 Pillar Cenotaph", type: "monuments" },
    { id: "15", text: "Orchha Palace Hotel", type: "hotels" },
    { id: "16", text: "60-Domed Mosque", type: "monuments" },
    { id: "17", text: "84 Pillar Cenotaph", type: "monuments" },
    { id: "18", text: "Orchha Palace Hotel", type: "hotels" },

];

const days = ["Day 1 - Delhi", "Day 2 - Agra"];

export default function DndKitDragDrop() {
    const [data, setData] = useState({
        "Day 1 - Delhi": { hotels: [], monuments: [] },
        "Day 2 - Agra": { hotels: [], monuments: [] },
    });

    const [editMode, setEditMode] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const handleDragStart = (event) => {
        setActiveItem(event.active.data.current);
    };

    const handleDragEnd = (event) => {
        const { over } = event;

        if (over && activeItem) {
            const dayKey = over.id;
            const type = activeItem.type;

            setData((prev) => {
                const existing = prev[dayKey][type];

                if (existing.includes(activeItem.text)) return prev;

                return {
                    ...prev,
                    [dayKey]: {
                        ...prev[dayKey],
                        [type]: [...existing, activeItem.text],
                    },
                };
            });
        }

        setActiveItem(null);
    };


    const renderContent = () => (
        <>
            {/* Colored Tags (Draggables) */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", height: "80px", overflowY: "scroll" }}>
                {initialItems.map((item) => (
                    <DraggableTag key={item.id} id={item.id} item={item} editMode={editMode} />
                ))}
            </div>

            {/* Day-wise Drop Zones */}
            <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
                {days.map((day) => (
                    <DayBox key={day} id={day} data={data[day]} setData={setData} editMode={editMode} />
                ))}
            </div>
        </>
    );



    return (
        <div style={{ padding: "20px" }}>
            <h2>Drag Tags into Day Slots</h2>
            <div style={{ marginBottom: "10px" }}>
                {editMode ? (
                    <button onClick={() => setEditMode(false)}>Save</button>
                ) : (
                    <button onClick={() => setEditMode(true)}>Edit</button>
                )}
            </div>

            {/* {editMode ? (
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {initialItems.map((item) => (
                            <DraggableTag key={item.id} id={item.id} item={item} />
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
                        {days.map((day) => (
                            <DayBox key={day} id={day} data={data[day]} setData={setData} />
                        ))}

                    </div>
                </DndContext>
            ) : (
                "renderContent()"
            )} */}
            {editMode ? (
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {renderContent()}
                    <DragOverlay>
                        {activeItem ? (
                            <div style={{
                                padding: "6px 12px",
                                background: "#ccc",
                                borderRadius: "6px",
                                cursor: "grabbing",
                            }}>
                                {activeItem.text}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            ) : (
                renderContent()
            )}


        </div>
    );
}

// Draggable Tag Component
function DraggableTag({ id, item, editMode }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: item,
    });

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        padding: "6px 12px",
        background: "#ccc",
        borderRadius: "6px",
        cursor: "grab",
    };

    if (!editMode) {
        return (
            <div
                style={{
                    padding: "6px 12px",
                    backgroundColor: "#ccc",
                    borderRadius: "6px",
                }}
            >
                {item.text}
            </div>
        );
    }

    // ✅ you forgot this return:
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {item.text}
        </div>
    );
}


// Drop Zone (Day Box)
function DayBox({ id, data, setData, editMode }) {

    const { setNodeRef, isOver } = useDroppable({ id });

    const style = {
        border: isOver ? "3px solid #007bff" : "2px dashed #999",
        borderRadius: "10px",
        padding: "16px",
        minWidth: "200px",
        backgroundColor: isOver ? "#e6f7ff" : "#f9f9f9",
    };

    const handleRemove = (type, itemText) => {
        setData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [type]: prev[id][type].filter((t) => t !== itemText),
            },
        }));
    };

    return (
        <div ref={setNodeRef} style={style}>
            <h4>{id}</h4>

            <strong>Hotels:</strong>
            <ul>
                {data.hotels.map((item, i) => (
                    <li key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        {item}
                        {editMode && (
                            <span
                                style={{ marginLeft: "10px", cursor: "pointer", color: "red" }}
                                onClick={() => handleRemove("monuments", item)}
                            >
                                &times;
                            </span>
                        )}

                    </li>
                ))}

            </ul>

            <strong>Monuments:</strong>
            <ul>
                {data.monuments.map((item, i) => (
                    <li key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                        {item}
                        <span
                            style={{ marginLeft: "10px", cursor: "pointer", color: "red" }}
                            onClick={() => handleRemove("monuments", item)}
                        >
                            &times;
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

