import React, { createRef, useEffect, useMemo, useRef } from 'react'
import { useCallback, useState } from "react"
import { useResizeObserver } from "@wojtekmaj/react-hooks"
import { pdfjs, Document, Page } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import pdfFile from './quy_dinh_chung.pdf'
import { Box, Typography } from '@mui/material'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const options = {
      cMapUrl: '/bcmaps/',
      cMapPacked: true,
      standardFontDataUrl: "/standard_fonts/"
    }
const resizeObserverOptions = {}
const maxWidth = 800

function Documents({scroll = 1}) {

  const [file, setFile] = useState(pdfFile)
  const [numPages, setNumPages] = useState(null)
  const [containerRef, setContainerRef] = useState(null)
  const [containerWidth, setContainerWidth] = useState()

  const onResize = useCallback(entries => {
    const [entry] = entries

    if (entry) {
      setContainerWidth(entry.contentRect.width)
    }
  }, [])

  useResizeObserver(containerRef, resizeObserverOptions, onResize)

  const pageRefs = useRef([]);

  // Hàm để lưu số trang
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array(numPages)
      .fill()
      .map(() => createRef());
  };

  // Hàm để tự động cuộn đến trang mong muốn
  const scrollToPage = (pageNumber) => {
    if (pageRefs.current[pageNumber - 1]?.current) {
      pageRefs.current[pageNumber - 1].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    numPages !== null && scrollToPage(scroll);
  }, [scroll]);

  useEffect(() => {
    document.querySelectorAll('.Document__container')[0].addEventListener('wheel', (event) => {
        const buffer = 50; // Khoảng cách thêm để tính toán vị trí đã cuộn
        const viewportHeight = window.innerHeight;
        pageRefs.current.forEach((div, index) => {
          const rect = div.current.getBoundingClientRect().top;
          if (rect >= 0 && rect < viewportHeight - buffer) {
            scroll = index
          }
      });
    });
  })

  const handleRenderError = (error) => {
    if (error.name === 'AbortException') {
      console.error('Render task cancelled. Ignoring the error.');
    } else {
      console.error('Render error:', error);
    }
  };

  return (
      <Box className="Document__container" sx = {{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: 'auto',
          padding: 0,
          height: '100%',
          width: '100%',
      }}>
        <Box 
          className="Document__container__page" 
          ref={setContainerRef}
          sx = {{ 
            width: '100%',
            maxWidth: 'calc(100% - 2em)',

            '& .react-pdf__Document':  {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },

            '& .react-pdf__Page': {
              marginTop: '4px',
              boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
              minHeight: '424px',

            },

            '& .react-pdf__message': {
              color: "white"
            }
          }}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            onRenderError={handleRenderError}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Box key={`page_${index + 1}`} className= {`page_${index + 1}`}>

                <Page
                  pageNumber={index + 1}
                  width={
                    containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                  }
                  renderMode="canvas"
                  loading={<div>Loading...</div>}
                  renderTextLayer={false}
                />

                <Typography variant='p' sx = {{ 
                  fontSize: '0.725rem',
                  display: 'block',
                  marginBottom: "0.5rem",
                  marginTop: "0.5rem",
                }}>
               {`Trang ${index + 1}`}
                </Typography>

                <div ref={pageRefs.current[index]}/>

              </Box>
            ))}
          </Document>
        </Box>
      </Box>
  )
}

export default Documents
