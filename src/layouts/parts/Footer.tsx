import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SDG Hub</h3>
            <p className="text-sm text-muted-foreground">
              Sustainable Development Goals Committee Platform
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/sdg-progress" className="text-muted-foreground hover:text-foreground">
                  SDG Progress
                </Link>
              </li>
              <li>
                <Link to="/international" className="text-muted-foreground hover:text-foreground">
                  International
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/best-practices" className="text-muted-foreground hover:text-foreground">
                  Best Practices
                </Link>
              </li>
              <li>
                <Link to="/policy-lab" className="text-muted-foreground hover:text-foreground">
                  Policy Lab
                </Link>
              </li>
              <li>
                <Link to="/knowledge-center" className="text-muted-foreground hover:text-foreground">
                  Knowledge Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              SDG Committee<br />
              Email: info@sdgcommittee.com
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SDG Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
