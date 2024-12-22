import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer footer-center p-6 text-base-content bg-gradient-to-r from-blue-200 via-purple-200 to-green-200">
      <div>
        <p className="font-medium text-lg">Repository</p>
        <div className="flex gap-6 mt-4 justify-center">
          <a
            href="https://github.com/ZB-DevOnOff"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-black flex items-center gap-2"
          >
            <FaGithub size={20} />
            DevOnOff
          </a>
          <a
            href="https://github.com/ZB-DevOnOff/FrontEnd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-black flex items-center gap-2"
          >
            <FaGithub size={20} />
            Frontend
          </a>
          <a
            href="https://github.com/your-backend-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-black flex items-center gap-2"
          >
            <FaGithub size={20} />
            Backend
          </a>
        </div>
        <div className="mt-6">
          <p className="font-medium text-lg">Team Members</p>
          <div className="flex flex-wrap gap-6 justify-center mt-3">
            {[
              { name: 'Member1', github: 'https://github.com/member1' },
              { name: 'Member2', github: 'https://github.com/member2' },
              { name: 'Member3', github: 'https://github.com/member3' },
              { name: 'Member4', github: 'https://github.com/member4' },
              { name: 'Member5', github: 'https://github.com/member5' },
              { name: 'Member6', github: 'https://github.com/member6' },
            ].map((member, index) => (
              <a
                key={index}
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-black flex items-center gap-2"
              >
                <FaGithub size={20} />
                {member.name}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center gap-4">
            {/* <a href="/terms" className="text-sm text-gray-700 hover:underline">
              이용약관
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-700 hover:underline"
            >
              개인정보처리방침
            </a> */}
            <p className="font-semibold">
              Copyright © {new Date().getFullYear()} - All rights reserved by
              DevOnOff
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
