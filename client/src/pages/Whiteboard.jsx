import {
  Stage,
  Layer,
  Line,
  Rect,
  Circle,
  Text,
  Arrow,
  Transformer
} from "react-konva";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
export default function Whiteboard() {
  const { roomId } = useParams();
  const { user: authUser } = useAuth();

  const stageRef = useRef(null);
  const trRef = useRef(null);

  const isRemoteUpdate = useRef(false);
  const startPos = useRef(null);

  const [lines, setLines] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [undoStack, setUndoStack] = useState([]);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [textInput, setTextInput] = useState("");
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [textScreenPos, setTextScreenPos] = useState({ x: 0, y: 0 });
  const [isTyping, setTyping] = useState(false);

  const scaleBy = 1.05;
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const getRelativePointer = () => {
    const pointer = stageRef.current.getPointerPosition();
    const transform = stageRef.current.getAbsoluteTransform().copy();
    transform.invert();
    return transform.point(pointer);
  };

  // SOCKET INIT
  useEffect(() => {
    socket.emit("join-room", { roomId, user: authUser });
    socket.emit("get-board", { roomId });

    socket.on("board-data", (board) => {
      const safe = Array.isArray(board) ? board : [];
      isRemoteUpdate.current = true;
      setLines(safe);
      setTimeout(() => (isRemoteUpdate.current = false), 0);
    });

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off("board-data");
    };
  }, [roomId, authUser]);

  const emitBoard = (data) => {
    if (!isRemoteUpdate.current)
      socket.emit("board-update", { roomId, boardData: data });
  };

  // MENU
  const exportImage = () => {
    const uri = stageRef.current.toDataURL();
    const a = document.createElement("a");
    a.href = uri;
    a.download = `board-${roomId}.png`;
    a.click();
  };

  const copyRoom = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };
  const clearBoard = () => { setLines([]); emitBoard([]); };

  const deleteShape = () => {
    if (selectedIndex === null) return;
    const updated = lines.filter((_, i) => i !== selectedIndex);
    setLines(updated);
    emitBoard(updated);
    setSelectedIndex(null);
    trRef.current?.nodes([]);
  };

  const undo = () => {
    if (!lines.length) return;
    setUndoStack([...undoStack, lines]);
    const updated = lines.slice(0, -1);
    setLines(updated);
    emitBoard(updated);
  };

  const redo = () => {
    if (!undoStack.length) return;
    const prev = undoStack.at(-1);
    setUndoStack(undoStack.slice(0, -1));
    setLines(prev);
    emitBoard(prev);
  };

  // ZOOM
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const oldScale = stageScale;
    const pointer = stageRef.current.getPointerPosition();
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale =
      direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);

    const mousePoint = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale
    };

    setStagePos({
      x: pointer.x - mousePoint.x * newScale,
      y: pointer.y - mousePoint.y * newScale
    });
  };

  // Laser fade
  const fadeLaser = (shape) => {
    let opacity = 1;
    const animate = () => {
      opacity -= 0.03;
      shape.opacity = opacity;
      stageRef.current.getLayers()[0].batchDraw();
      if (opacity > 0) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  // ---------------- MOUSE DOWN
  const handleMouseDown = () => {
    if (tool === "move") return;

    const pos = getRelativePointer();
    startPos.current = pos;

    if (tool === "pen") {
      setCurrentShape({
        type: "line",
        stroke: color,
        strokeWidth,
        lineCap: "round",
        points: [pos.x, pos.y],
      });
    }

    if (tool === "eraser") {
      setCurrentShape({
        type: "line",
        eraser: true,
        stroke: "white",
        strokeWidth: strokeWidth * 2,
        lineCap: "round",
        globalCompositeOperation: "destination-out",
        points: [pos.x, pos.y],
      });
    }

    if (tool === "laser") {
      setCurrentShape({
        type: "line",
        laser: true,
        stroke: "red",
        opacity: 1,
        strokeWidth: strokeWidth * 2,
        lineCap: "round",
        points: [pos.x, pos.y],
      });
    }

    if (tool === "highlight") {
      setCurrentShape({
        type: "line",
        stroke: "rgba(255,255,0,0.3)",
        strokeWidth: strokeWidth * 4,
        lineCap: "round",
        points: [pos.x, pos.y],
      });
    }
  };

  // TEXT
  const handleTextStart = () => {
    const pos = getRelativePointer();
    const pointer = stageRef.current.getPointerPosition();
    setTyping(true);
    setTextInput("");
    setTextPos(pos);
    setTextScreenPos(pointer);
  };

  const finalizeText = () => {
    if (!textInput.trim()) { setTyping(false); return; }

    const newText = {
      type: "text",
      x: textPos.x,
      y: textPos.y,
      text: textInput,
      fontSize: strokeWidth * 6,
      fill: color
    };

    const updated = [...lines, newText];
    setLines(updated);
    emitBoard(updated);
    setTyping(false);
  };

  const handleTextKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finalizeText();
    } else if (e.key === "Escape") {
      setTyping(false);
      setTextInput("");
    }
  };

  // ---------------- MOUSE MOVE
  const handleMouseMove = () => {
    if (!startPos.current) return;

    const pos = getRelativePointer();
    const sp = startPos.current;

    // Pen / Eraser / Highlight / Laser continue
    if (currentShape?.type === "line"
      && (tool === "pen" || tool === "eraser" || tool === "highlight" || tool === "laser")) {
      setCurrentShape((prev) => ({
        ...prev,
        points: [...prev.points, pos.x, pos.y]
      }));
      return;
    }

    if (tool === "rect") {
      setCurrentShape({
        type: "rect",
        x: Math.min(sp.x, pos.x),
        y: Math.min(sp.y, pos.y),
        width: Math.abs(sp.x - pos.x),
        height: Math.abs(sp.y - pos.y),
        stroke: color,
        strokeWidth
      });
      return;
    }

    if (tool === "circle") {
      const r = Math.sqrt((pos.x - sp.x) ** 2 + (pos.y - sp.y) ** 2);
      setCurrentShape({
        type: "circle",
        x: sp.x,
        y: sp.y,
        radius: r,
        stroke: color,
        strokeWidth
      });
      return;
    }

    if (tool === "line") {
      setCurrentShape({
        type: "line",
        points: [sp.x, sp.y, pos.x, pos.y],
        stroke: color,
        strokeWidth
      });
      return;
    }

    if (tool === "arrow") {
      setCurrentShape({
        type: "arrow",
        points: [sp.x, sp.y, pos.x, pos.y],
        stroke: color,
        strokeWidth
      });
      return;
    }
  };

  // ---------------- MOUSE UP
  const handleMouseUp = () => {
    if (!currentShape) return;

    if (currentShape.laser) {
      fadeLaser(currentShape);
      setCurrentShape(null);
      return;
    }

    const updated = [...lines, currentShape];
    setLines(updated);
    emitBoard(updated);

    setCurrentShape(null);
    startPos.current = null;
  };

  // ---------------- DRAG
  const handleDragEnd = (index, e) => {
    const pos = e.target.position();
    const updated = [...lines];
    updated[index] = { ...updated[index], x: pos.x, y: pos.y };
    setLines(updated);
    emitBoard(updated);
  };

  // ---------------- TRANSFORM
  useEffect(() => {
    if (tool === "move") {
      trRef.current?.nodes([]);
      return;
    }
    if (selectedIndex === null) {
      trRef.current?.nodes([]);
      return;
    }
    const node = stageRef.current.findOne(`#shape-${selectedIndex}`);
    if (node) trRef.current.nodes([node]);
  }, [selectedIndex, tool]);

  const handleTransformEnd = () => {
    if (selectedIndex === null) return;
    const node = stageRef.current.findOne(`#shape-${selectedIndex}`);
    const updated = [...lines];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY()
    };
    setLines(updated);
    emitBoard(updated);
    setSelectedIndex(null);
    trRef.current?.nodes([]);
  };

  return (
    <div className="relative h-screen w-screen bg-gray-200 select-none">

      {/* TEXT OVERLAY */}
      {isTyping && (
        <input
          className="absolute z-50 border-2 border-blue-500 p-2 bg-white rounded shadow-lg"
          style={{ 
            top: `${textScreenPos.y}px`, 
            left: `${textScreenPos.x}px`,
            minWidth: "200px"
          }}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={finalizeText}
          autoFocus
        />
      )}

      {/* MENU */}
      <div className="absolute top-3 left-3 z-50">
        <button className="text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        {menuOpen && (
          <div className="absolute left-0 top-10 bg-white shadow rounded p-2 space-y-2  w-40">
            <button onClick={exportImage} className="cursor-pointer">Export PNG</button>
            <button onClick={copyRoom} className="cursor-pointer">Copy Room ID</button>
            <button onClick={clearBoard}  className="cursor-pointer">Clear Board</button>
            <button onClick={deleteShape} className="cursor-pointer">Delete Selected</button>
          </div>
        )}
      </div>

      {/* TOOLBAR */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white p-2 rounded shadow flex gap-3 z-40">

        <button className={tool === "pen" && "border-b-2"} onClick={() => setTool("pen")}>✎</button>
        <button className={tool === "eraser" && "border-b-2"} onClick={() => setTool("eraser")}>🧽</button>
        <button className={tool === "laser" && "border-b-2"} onClick={() => setTool("laser")}>🔴</button>
        <button className={tool === "highlight" && "border-b-2"} onClick={() => setTool("highlight")}>▦</button>

        <button className={tool === "rect" && "border-b-2"} onClick={() => setTool("rect")}>▭</button>
        <button className={tool === "circle" && "border-b-2"} onClick={() => setTool("circle")}>◯</button>
        <button className={tool === "line" && "border-b-2"} onClick={() => setTool("line")}>─</button>
        <button className={tool === "arrow" && "border-b-2"} onClick={() => setTool("arrow")}>➤</button>

        <button className={tool === "text" && "border-b-2"} onClick={() => setTool("text")}>T</button>
        <button className={tool === "move" && "border-b-2"} onClick={() => setTool("move")}>✥</button>

        <button onClick={undo}>↩</button>
        <button onClick={redo}>↪</button>

        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="20" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)} />
      </div>

      {/* STAGE */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        scale={{ x: stageScale, y: stageScale }}
        position={stagePos}
        onWheel={handleWheel}
        onMouseDown={(e) => (tool === "text" ? handleTextStart() : handleMouseDown())}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          background: "white",
          cursor: tool === "move" ? "move" : "crosshair"
        }}
      >
        <Layer>
          {/* SAVED SHAPES */}
          {lines.map((shape, i) => {
            const id = `shape-${i}`;
            const common = {
              id,
              key: i,
              draggable: tool === "move",
              onDragEnd: (e) => handleDragEnd(i, e),
              onClick: () => setSelectedIndex(i)
            };

            if (shape.type === "rect") return <Rect {...shape} {...common} />;
            if (shape.type === "circle") return <Circle {...shape} {...common} />;
            if (shape.type === "arrow") return <Arrow {...shape} {...common} />;
            if (shape.type === "text") return <Text {...shape} {...common} />;
            if (shape.type === "highlight") return <Line {...shape} {...common} />;

            if (shape.type === "line") {
              return (
                <Line
                  {...shape}
                  {...common}
                  stroke={shape.eraser ? "white" : shape.stroke}
                  globalCompositeOperation={
                    shape.eraser ? "destination-out" : "source-over"
                  }
                  lineCap="round"
                />
              );
            }

            return null;
          })}

          {/* TRANSFORMER */}
          {selectedIndex !== null && tool !== "move" && (
            <Transformer ref={trRef} rotateEnabled onTransformEnd={handleTransformEnd} />
          )}

          {/* PREVIEW SHAPE */}
          {currentShape && (() => {
            if (currentShape.type === "rect") {
              return <Rect {...currentShape} stroke={currentShape.stroke} strokeWidth={currentShape.strokeWidth} />;
            }

            if (currentShape.type === "circle") {
              return <Circle {...currentShape} stroke={currentShape.stroke} strokeWidth={currentShape.strokeWidth} />;
            }

            if (currentShape.type === "arrow") {
              return <Arrow {...currentShape} stroke={currentShape.stroke} strokeWidth={currentShape.strokeWidth} />;
            }

            if (currentShape.type === "line") {
              return (
                <Line
                  {...currentShape}
                  stroke={
                    currentShape.eraser
                      ? "white"
                      : currentShape.laser
                      ? "red"
                      : currentShape.stroke
                  }
                  globalCompositeOperation={
                    currentShape.eraser ? "destination-out" : "source-over"
                  }
                  opacity={currentShape.opacity ?? 1}
                  lineCap="round"
                />
              );
            }

            return null;
          })()}
        </Layer>
      </Stage>
    </div>
  );
}
