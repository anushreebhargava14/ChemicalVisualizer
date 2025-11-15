import sys, requests
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QFileDialog, QLabel, QListWidget
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

API = "http://127.0.0.1:8000/api"

class App(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer - Desktop")
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)
        self.auth = (input("Enter username: "), input("Enter password: "))
        self.upload_btn = QPushButton("Upload CSV")
        self.upload_btn.clicked.connect(self.upload)
        self.refresh_btn = QPushButton("Refresh History")
        self.refresh_btn.clicked.connect(self.load)
        self.list = QListWidget()
        self.label = QLabel("Summary")
        self.fig = Figure()
        self.canvas = FigureCanvas(self.fig)
        for w in [self.upload_btn, self.refresh_btn, self.list, self.label, self.canvas]:
            self.layout.addWidget(w)
        self.list.itemClicked.connect(self.show_summary)
        self.load()

    def upload(self):
        fname, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv)")
        if not fname: return
        with open(fname, 'rb') as f:
            files = {'file': (fname.split('/')[-1], f, 'text/csv')}
            requests.post(f"{API}/upload/", files=files, auth=self.auth)
        self.load()

    def load(self):
        res = requests.get(f"{API}/datasets/", auth=self.auth)
        print(res.status_code, res.text)
        self.data = res.json()
        self.list.clear()
        for d in self.data:
            self.list.addItem(f"{d['id']} - {d['filename']}")

    def show_summary(self, item):
        did = int(item.text().split(' - ')[0])
        ds = next(d for d in self.data if d['id']==did)
        s = ds['summary']
        self.label.setText(str(s))
        self.fig.clear()
        ax = self.fig.add_subplot(111)
        ax.pie(s['type_distribution'].values(), labels=s['type_distribution'].keys(), autopct='%1.1f%%')
        self.canvas.draw()

app = QApplication(sys.argv)
w = App()
w.show()
sys.exit(app.exec_())
