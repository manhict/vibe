"use client";

import React, { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUserContext } from "@/store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { emitMessage } from "@/lib/customEmits";
import { searchResults } from "@/lib/types";

export default function DraggableOptions() {
  const { showDragOptions, setQueue, user, setShowDragOptions } =
    useUserContext();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDelete = useCallback(
    (song: searchResults) => {
      emitMessage("deleteSong", {
        queueId: song?.queueId,
        addedBy: song?.addedBy,
      });
      if (user?.role === "admin" || song.addedBy === user?._id) {
        setQueue((prev) => prev.filter((s) => s.id !== song.id));
      }
    },
    [setQueue, user]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const jsonData = e.dataTransfer.getData("application/json");
      if (!jsonData) return;
      const song = JSON.parse(jsonData);
      if (!song) return;
      setIsDragging(false);
      setShowDragOptions(false);
      handleDelete(song);
    },
    [handleDelete, setShowDragOptions]
  );

  return (
    <div
      className="fixed z-50  w-full"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
    >
      <AnimatePresence>
        {showDragOptions && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card
              className={`fixed  left-1/2  -translate-x-1/2 bottom-5 w-44 h-28 transition-all duration-200 ease-in-out ${
                isDragging ? "scale-105" : "scale-100"
              }`}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="p-0 h-full">
                <div
                  className={`relative w-full h-full border border-dashed rounded-lg ${
                    isDragging ? "border-red-500" : "border-muted"
                  }`}
                >
                  <Trash2
                    className={`absolute ${
                      isDragging && "text-red-500 opacity-100"
                    } inset-0 m-auto text-muted-foreground opacity-25 w-14 h-14`}
                  />
                  <button
                    className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                    aria-label="Close drop area"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
